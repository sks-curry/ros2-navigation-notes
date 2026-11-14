# Humble：VLN、Nav2 与底盘如何衔接

更新：2026-11-14。当前学习环境已确认使用 ROS 2 Humble；路线以 Ubuntu 22.04 + Humble 为基线。以下是建议的学习与接口设计，不代表已经完成实验。

## “VLN 加底层”是什么意思

VLN（视觉语言导航）根据语言指令和视觉观察决定下一步去哪里。例如“经过门口，在椅子旁停下”。在本学习方案中，上层生成可执行的目标位姿或航点，Nav2 负责路径规划、局部避障与跟踪，底盘驱动和下位机负责实际运动。这是一种分层实现方案，并非所有 VLN 模型都采用此结构。

| 层次 | 输入 | 输出 | 负责的问题 |
| --- | --- | --- | --- |
| 视觉语言任务层 | 指令、图像、历史观察 | 目标对象或子任务 | 去哪里、任务是否完成 |
| 目标适配层 | 视觉目标、深度、相机内参、TF | map 坐标系中的目标位姿 | 如何把语义目标变成可达位置 |
| Nav2 导航层 | 目标、定位、代价地图 | 路径和速度指令 | 路怎么走、怎样避障和跟踪 |
| 底盘与电机层 | 速度指令、编码器 | 轮速控制、里程计反馈 | 让轮子按要求转动 |

相对于 VLN，Nav2 可以称为底层导航；相对于 Nav2，STM32、底盘驱动和电机控制才是更底层。STM32 是一种实现选择，不是使用 Nav2 的必需条件。仿真时可由仿真底盘代替真实电机。

## 先完成三个递进实验

1. 固定坐标导航：在已有地图上，从 RViz 到 Python，完成 A → B → C 巡航，验证成功、失败和取消。
2. 文字到预定义地点：用“去门口”查找人工标定的地点表，再发送目标。这是语言地点映射基线，不算视觉语言导航。
3. 视觉语义目标：识别椅子，结合深度与 TF 估计位置，选取椅子附近的可通行停靠点，再交给 Nav2。单目标语义导航仍不同于完整多步骤 VLN。

不要直接把目标物体中心作为机器人目标：它可能落在障碍物内。目标适配层需考虑机器人轮廓、停靠距离、可达性和朝向。仅有二维检测框无法直接得到可靠的地图坐标；缺少深度或定位时应报告无法确定目标。

## Humble 对接接口

优先使用 nav2_simple_commander 的 BasicNavigator。按所装 Humble 源码核对 setInitialPose、waitUntilNav2Active、goToPose、getFeedback、isTaskComplete、getResult 和 cancelTask。它们用于设置初始位姿、等待就绪、发送目标、获取反馈、判断结果及取消。

目标使用 geometry_msgs/PoseStamped；本方案采用 map 坐标系，填入有效时间戳和单位四元数。不要把相机坐标未经 TF 转换直接当作 map 坐标。仿真节点应统一 use_sim_time，并确保 /clock 正常；真机使用匹配的系统时间。

建议状态流程：等待指令 → 观察 → 生成候选目标 → 检查可达性 → 导航执行 → 检查任务完成。识别不确定、TF 过期、无深度、不可达和超时分别记录；重新发目标前处理旧任务取消，限制重试次数。

Nav2 到达目标只代表几何导航成功，不保证“正确找到指定椅子”。任务层还需要核对对象与语言条件。

## 推荐学习顺序与验收

| 阶段 | 内容 | 验收条件 |
| --- | --- | --- |
| 1 | ROS 2 Topic、Action、TF、Launch、Lifecycle | 能检查 /scan、/odom、TF 和节点状态 |
| 2 | 已有地图 + AMCL + RViz 单点导航 | 重启后能重复完成导航 |
| 3 | Python 三点巡航 | 记录成功、取消、不可达三类结果 |
| 4 | 建图、代价地图和控制器调参 | 固定场景，每次只改一个主要因素 |
| 5 | 文字到地点表 | 明确识别失败时不发送目标 |
| 6 | 视觉目标到地图位姿 | 用已知目标检查坐标与停靠距离 |
| 7 | 真机或多步骤 VLN | 有稳定基线后再扩展和评测 |

原 8 周计划中的 A* / 自定义规划器保留为算法研究支线。如果主要目标是 VLN 集成，它不是接入视觉语言层的前置条件；若论文研究的是路径规划，则继续按原第 5–7 周推进。

## 官方源码阅读地图

以下链接固定为 Humble 分支；分支仍会更新，复现实验应另外记录具体 commit 和已安装包版本。

| 学习问题 | 官方源码入口 |
| --- | --- |
| 系统如何启动 | [nav2_bringup](https://github.com/ros-navigation/navigation2/tree/humble/nav2_bringup) |
| 参数配置在哪里 | [nav2_params.yaml](https://github.com/ros-navigation/navigation2/blob/humble/nav2_bringup/params/nav2_params.yaml) |
| Python 如何发任务 | [Simple Commander](https://github.com/ros-navigation/navigation2/tree/humble/nav2_simple_commander) |
| 行为树如何协调 | [nav2_bt_navigator](https://github.com/ros-navigation/navigation2/tree/humble/nav2_bt_navigator) |
| 插件遵守什么接口 | [nav2_core](https://github.com/ros-navigation/navigation2/tree/humble/nav2_core) |
| VLN 数据集和评测 | [VLN-CE](https://github.com/jacobkrantz/VLN-CE) |

阅读方法：launch → YAML → 插件接口 → 关键函数 → 测试。官网 Rolling / Jazzy 内容可用于理解概念，但参数和接口以 Humble 源码为准。VLN-CE 使用 Habitat，不是可以直接启动的 Humble 真机工程。

## 实验记录与排错

每次记录：环境与版本、代码 commit、地图、起终点或指令、配置、随机种子（若适用）、成功条件、超时阈值、耗时、实际路径长度、碰撞判定方式、失败阶段、日志位置。

分开统计：语义目标选择是否正确、Nav2 是否到达、整体任务是否完成。全部尝试都计入成功率分母；只统计成功试验的耗时需明确注明。没有参考最短路径与统一协议时，不声称得到可比较的 SPL。

按层排错：仿真时间与资源 → 传感器和 TF → 定位 → 代价地图 → 导航 Action → 底盘执行 → 语义目标。之前 VMware 的 soft lockup 日志说明存在系统卡顿线索，不能直接判定是 Nav2 或自动更新故障。

参考：[ROS 2 Humble 教程](https://docs.ros.org/en/humble/Tutorials.html)、[Humble Commander 实现](https://github.com/ros-navigation/navigation2/blob/humble/nav2_simple_commander/nav2_simple_commander/robot_navigator.py)、[Nav2 官网](https://docs.nav2.org/)。

