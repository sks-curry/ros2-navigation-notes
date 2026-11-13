# ROS 2 / VLN 八周学习计划

> 本页源自 [Notion 学习笔记](https://juniper-selenium-d99.notion.site/414e4d9d57e68120bd24e9d96062b590)

<quote>
目标：用 8 周建立一条从 ROS 2 基础、Nav2 仿真、自定义方法到真机实验和视觉语言导航原型的学习主线。

时间假设：每周约 20–25 小时。你之前的机器人学计划以每周 10–12 小时为例；如果仍按这个投入，建议将本计划拉长至约 12–16 周。8 周是入门与原型目标，不保证论文创新或复杂 VLN 真机部署在此期间完成。
</quote>

关联学习资料：[机器人学 10 周入门计划｜Python · C/C++ · STM32 · ROS 2](https://app.notion.com/p/407e4d9d57e6818698c9ee452e6dc653)

## 一、先看整体路线

传感器与底盘 → 建图 / 定位 → Nav2 规划与控制 → 真机导航 → 自定义论文方法 → 视觉语言目标导航。

- SLAM Toolbox：使用传感器数据进行二维建图和位姿估计。
- AMCL：在已有地图上估计机器人位置。
- Nav2：规划路径、控制机器人沿路径运动、处理障碍和恢复行为。
- STM32 等下位机：接收速度指令，结合编码器和电机驱动完成底盘控制。
- VLN / 语义层：结合视觉和语言理解任务，输出目标、航点或动作；具体取决于所选模型。
- 优先级：可运行的基线真机 > 自定义方法及实验 > 简单语义目标导航 > 复杂 VLN。

## 二、8 周执行表

| 周次 | 学习与实操 | 周末最低成果 |
| --- | --- | --- |
| 第 1 周 | ROS 2：节点、Topic、Action、TF、Launch、Python / C++ 基础；启动仿真 | 能查看 /scan、/odom、TF，写发布与订阅节点 |
| 第 2 周 | Gazebo + 机器人；SLAM Toolbox 建图、地图保存与加载；AMCL 定位 | 建立并重载一张地图，解释 map → odom → base_link |
| 第 3 周 | Nav2 基线：NavFn + DWB，理解代价地图、规划器和控制器；尝试 RPP | 仿真中到达多个目标；比较两种控制配置并记录 |
| 第 4 周 | 真机底盘、编码器、雷达、TF、里程计；低速建图与 Nav2 导航 | 前提是已有可用硬件：完成短距离导航；无硬件则记录仿真基线及硬件接口清单 |
| 第 5 周 | 阅读论文与 Nav2 插件教程；实现 A\* 原型，跑通直线规划插件 | 独立 A\* 小地图及可加载的示例插件 |
| 第 6 周 | 将 A\* 或论文方法封装为 Nav2 插件；配置基线对比 | 相同场景下完成基线和自定义规划器的仿真对比 |
| 第 7 周 | 实机对比、参数固定、录 rosbag；统计成功率、时间、路径长度 | 有硬件：完成重复试验与初步表格；无硬件：完成仿真实验设计，不宣称真机结果 |
| 第 8 周 | 简单语义目标导航：文字指令 → 识别目标 → 估计位置 → Nav2 目标 | 先仿真中实现“去椅子旁”等单目标原型；有匹配相机再尝试真机 |

进度调整：第 4 周硬件没准备好，不等待设备；先完成第 5–6 周仿真，硬件到位后补真机。论文主方法尚未选定时，A\* 只是练习基线，不应当作已确定的创新点。

## 三、逐周任务与验收

### 第 1 周｜ROS 2 必要基础

- [ ] 按机器人或目标项目选择系统和 ROS 2 发行版；检查传感器驱动和 Gazebo 兼容性。
- [ ] 理解 Node、Topic、Service、Action：导航任务有目标、反馈与结果，适合 Action。
- [ ] 编写 Python 发布者、订阅者；读一个 C++ 节点。
- [ ] 查看节点、话题、消息与 TF；知道 rosbag 的录制和回放。
- [ ] 启动机器人仿真，观察雷达和里程计。

验收：画出“雷达 → ROS 2 话题 → 可视化”的数据流，能解释 map、odom、base_link 的作用。

资料：[ROS 2 教程（Humble）](https://docs.ros.org/en/humble/Tutorials.html)；[ROS 2 官方示例](https://github.com/ros2/examples)。

### 第 2 周｜SLAM 建图与定位

- [ ] 遥控仿真机器人；观察 /scan、/odom、TF 是否一致。
- [ ] 使用 SLAM Toolbox 建图并保存地图。
- [ ] 重启后加载地图，用 AMCL 设置初始位姿并定位。
- [ ] 记录地图质量、漂移以及产生问题时的现象。

验收：不看教程完成“建图 → 保存 → 重启 → 加载 → 定位”。

资料：[slam_toolbox](https://github.com/SteveMacenski/slam_toolbox)；[Nav2 边建图边导航](https://docs.nav2.org/lyrical/tutorials/general_tutorials/navigation2_with_slam/navigation2_with_slam/)。

#### Humble 仿真与建图：官方参考

- [Nav2 快速入门](https://docs.nav2.org/jazzy/getting_started/quickstart/quickstart/)：页面为 Jazzy 文档，但安装和运行步骤提供 “Iron and older” 选项，Humble 应选择此选项，并将示例中的 iron 改为 humble。
- [Nav2 Humble 分支：TurtleBot3 仿真启动文件](https://github.com/ros-navigation/navigation2/blob/humble/nav2_bringup/launch/tb3_simulation_launch.py)：包含 slam 参数，可使用 slam:=True 启动建图模式。
- [Nav2 边建图边导航](https://docs.nav2.org/lyrical/tutorials/general_tutorials/navigation2_with_slam/navigation2_with_slam/)：参考 SLAM Toolbox 建图与保存地图的流程；该页面属于 Lyrical，命令和版本差异需结合 Humble 核对。

### 第 3 周｜Nav2 基线

- [ ] 运行 Nav2，使用 RViz 设置目标点。
- [ ] 查看全局路径、本地代价地图、障碍物膨胀与速度命令。
- [ ] 理解 Planner 负责规划路径、Controller 根据路径和局部环境生成运动命令。
- [ ] 固定规划器及地图，比较 DWB 与 RPP 的跟踪行为。
- [ ] 在开阔区域与狭窄通道各做一次记录。

验收：解释“目标点 → 规划器 → 控制器 → 速度命令”的流程。实验中每次只改一个主要因素。

资料：[Nav2 官方仓库](https://github.com/ros-navigation/navigation2)；[Nav2 配置指南](https://docs.nav2.org/jazzy/configuration_and_development/configuration_guide/)；[Nav2 插件列表](https://docs.nav2.org/jazzy/configuration_and_development/navigation_plugins/)。

### 第 4 周｜真机底层与导航

- [ ] 核对底盘型号、通信方式、雷达、编码器、IMU 与现有驱动。
- [ ] 单独验证电机正反转、速度方向、编码器、里程计及雷达。
- [ ] 检查 map → odom → base_link → 传感器的 TF，避免重复发布同一变换。
- [ ] 遥控建图，加载地图并定位，再做短距离 Nav2 导航。
- [ ] 配置可用急停、速度限制、命令超时停车；空旷场地低速测试。

理解：Nav2 给出机器人线速度 v 和角速度 ω，底盘驱动将其转换成轮速，下位机结合编码器控制电机。差速轮机器人轮距 L 时：v_L = v − ωL/2，v_R = v + ωL/2。

资料：[Nav2 新机器人配置指南](https://docs.nav2.org/rolling/configuration_and_development/first_time_robot_setup_guide/)；[Linorobot2](https://github.com/linorobot/linorobot2)；[TurtleBot3](https://github.com/ROBOTIS-GIT/turtlebot3)。

### 第 5–6 周｜自建导航包与论文方法

- [ ] 明确论文方法属于全局规划、局部控制、代价地图还是上层决策；画输入输出。
- [ ] 运行官方直线规划器插件，检查类接口、插件注册和 YAML。
- [ ] 在独立二维栅格上实现 A\*；验证障碍、无法到达和起终点边界。
- [ ] 按实际 ROS 2 发行版的 API 将自定义规划算法接入 Nav2。
- [ ] 在相同地图、起终点、控制器与速度约束下比较基线与自定义方法。
- [ ] 保存代码版本、参数、地图、日志和结果。

建议首先替换单一模块：保留定位、代价地图和控制器，仅比较全局规划器。算法有无创新应通过文献和对比判断。

资料：[编写规划器插件](https://docs.nav2.org/rolling/tutorials/plugin_tutorials/writing_new_planner_plugin/writing_new_planner_plugin/)；[编写控制器插件](https://docs.nav2.org/rolling/tutorials/plugin_tutorials/writing_new_controller_plugin/writing_new_controller_plugin/)；[PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics)。Rolling 教程接口可能不同于 Humble / Jazzy，请以所装版本源码与文档为准。

### 第 7 周｜论文实验

- [ ] 写明目标、假设、基线、方法及评价指标。
- [ ] 设定开阔、狭窄、障碍场景，规定相同起终点与超时标准。
- [ ] 多次重复，记录成功与失败；明确碰撞如何判定。
- [ ] 比较成功率、路径长度、耗时、规划耗时和最小障碍距离；如有消融项，单独测试。
- [ ] 记录 rosbag、视频、参数、软硬件版本；整理失败原因。

必须说明耗时是否只统计成功样本、距离和碰撞的测量方式。未经真机验证的结果标为仿真。

### 第 8 周｜VLN / 语义导航原型

- [ ] 输入“去椅子旁”，先提取目标类别。
- [ ] 相机检测目标，结合深度、相机内参与 TF 估计位置。
- [ ] 在物体附近选择可通行、留有距离的目标位姿，发送给 Nav2。
- [ ] 处理无深度、识别失败、不可达、导航超时等情况。
- [ ] 将目标点、图像和导航结果保存，分析误差来源。

这是单目标语义导航原型；完整 VLN 通常还涉及多步骤指令、场景记忆、探索和评测，不应将简单目标检测直接等同于完整 VLN。模型可能输出全局目标、局部航点、离散动作或速度，需要分别编写适配接口。

资料：[Semantic-nav-amr](https://github.com/Gukdoli/Semantic-nav-amr)（ROS 2 语义导航参考；核对依赖）；[VLN-CE](https://github.com/jacobkrantz/VLN-CE)（Habitat 仿真基准，非开箱即用 ROS 2 真机包）；[VLN sim2real](https://github.com/batra-mlp-lab/vln-sim2real)（早期 ROS 项目，借鉴迁移思路）；[SysNav-CMU-VLN](https://github.com/yuezhiyuanting/SysNav-CMU-VLN)（较复杂，计算配置要求较高）。

## 四、导航包速查

| 类别 | 包 / 方法 | 先学什么 |
| --- | --- | --- |
| 二维建图 | SLAM Toolbox | /scan、TF、建图和存图 |
| 地图定位 | AMCL、Map Server | 已有地图、初始位姿 |
| 其他 SLAM | RTAB-Map、Cartographer | 按传感器和研究需求选学 |
| 全局规划 | NavFn、Smac | 起点、目标、全局代价地图、路径 |
| 局部控制 | DWB、RPP、MPPI | 路径跟踪、速度命令、局部障碍 |
| 速度与硬件 | 底盘驱动、编码器、IMU、robot_localization | 控制方向、里程计、传感器融合 |
| 任务与语言 | Action、行为树、语义识别 | 子目标生成及失败处理 |

[RTAB-Map ROS](https://github.com/introlab/rtabmap_ros) 可参考视觉 / RGB-D 建图。先完成一条稳定基线，再按硬件和论文需要扩展，8 周内不要求完整掌握全部系统。

## 五、开源项目学习方法

1. 先看 README：任务、ROS 版本、仿真或真机、传感器、GPU、安装步骤和许可证。
2. 固定可复现环境，记录发行版、分支 / commit 和依赖。
3. 跑通作者最小示例，记录运行命令和结果；失败先解决版本、依赖与驱动。
4. 从 launch 进入，找到 YAML、节点、订阅与发布的话题、消息类型与坐标系。
5. 只选择一条关键数据流深入，例如“目标点 → 规划器 → 路径”。
6. 每次修改一个参数或模块，对比运行结果，画出自己的数据流图。
7. 记录项目可复用部分与不能直接使用的假设；查论文确认方法与代码对应关系。

复盘模板：项目 / commit；环境；目标；输入与输出；运行命令；修改；结果；报错及解决方法；下次要验证的问题。

## 六、环境与待确认事项

- 已有机器人、雷达或论文代码时，优先服从其驱动和版本兼容要求。已有学习计划使用 Ubuntu 22.04 + ROS 2 Humble；如果你的现有系统是这一组合可继续用，不必为新计划重装。
- 全新环境可考虑 Ubuntu 24.04 + ROS 2 Jazzy，并先核对 Gazebo、Nav2、硬件驱动及模型依赖。
- 需要进一步明确：你的 ROS 2 / C++ 基础、每天可投入时间、真机底盘和传感器、GPU、论文方法与截止时间。这些将决定 8 周是否可行及各阶段先后顺序。
- 首个行动：列出手头机器人与电脑配置，并完成第 1 周的 ROS 2 节点与仿真检查。

## 七、开源项目学习顺序与验收

按同一仿真平台贯通，不要把每个仓库理解为都需完整部署。时间与前面的 8 周任务重叠。

| 顺序 | 对应时间 | 项目与方式 | 交付与继续条件 |
| --- | --- | --- | --- |
| 1 | 第 1 周 | [ros2/examples](https://github.com/ros2/examples)：运行并改写 Python、C++ 发布与订阅示例 | 写一个发布、订阅节点，能用命令查看话题 |
| 2 | 第 1–2 周 | [Nav2 最小 TurtleBot 仿真](https://github.com/ros-navigation/nav2_minimal_turtlebot_simulation)：按发行版选分支；或选匹配版本的 [TurtleBot3 仿真](https://github.com/ROBOTIS-GIT/turtlebot3_simulations) | 启动 Gazebo / RViz，观察雷达、里程计和 TF |
| 3 | 第 2 周 | [SLAM Toolbox](https://github.com/SteveMacenski/slam_toolbox)：在步骤 2 的机器人上运行建图；[官方 SLAM 教程](https://docs.nav2.org/lyrical/tutorials/general_tutorials/navigation2_with_slam/navigation2_with_slam/) | 保存并加载地图，完成 AMCL 定位 |
| 4 | 第 3 周 | [Nav2](https://github.com/ros-navigation/navigation2)：[Jazzy 快速入门](https://ros-navigation.github.io/mkdocs.nav2.org/jazzy/getting_started/quickstart/quickstart/) | 点到点导航；看路径、代价地图和速度；比较 DWB / RPP |
| 5 | 第 4 周 | [Linorobot2](https://github.com/linorobot/linorobot2) 或实际机器人厂商仓库：重点读底盘、通信、里程计、雷达和 launch | 有兼容硬件：低速完成短距离真机导航；否则先阅读接口并继续仿真 |
| 6 | 第 5 周 | [PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics)：只学 A\* 路径规划示例 | 说清 open / closed、代价函数，自己在栅格地图实现 A\* |
| 7 | 第 5–6 周 | [Nav2 Jazzy 自定义规划器教程](https://ros-navigation.github.io/mkdocs.nav2.org/jazzy/tutorials/plugin_tutorials/writing_new_planner_plugin/writing_new_planner_plugin/)：学习直线规划插件 | 编译加载插件；掌握接口、注册及 YAML 配置 |
| 8 | 第 6–7 周 | 自建导航包：结合论文及步骤 6–7，接入自定义规划方法 | 固定地图、起终点和控制器，完成仿真对比；有条件再做真机重复实验 |
| 9 | 第 8 周 | [Semantic-nav-amr](https://github.com/Gukdoli/Semantic-nav-amr)：阅读语言、视觉、目标坐标与 Nav2 对接 | 先做文字 → 目标识别 → 可通行目标点 → Nav2 的仿真原型；项目自述依赖 Humble / 特定机器人和相机 |
| 10 | 后续进阶 | [VLN-CE](https://github.com/jacobkrantz/VLN-CE)：研究 Habitat 数据集、模型及评测；[VLN Sim2Real](https://github.com/batra-mlp-lab/vln-sim2real) 阅读仿真到真机方法 | 区分语义目标导航与多步骤 VLN；后者使用旧 ROS 版本，不可当作现成 ROS 2 工程 |

说明：先按手头机器人和驱动固定 ROS 2 版本，核对每个仓库支持的分支、Gazebo、硬件和计算条件。上述时间均为参考；论文创新、完整 VLN 和真机部署耗时取决于基础与平台条件。

[Ubuntu 22.04 + ROS 2 Humble 常用命令知识库｜Linux · ROS 2 · Nav2 · 排错](https://app.notion.com/p/416e4d9d57e6810181bbdf338943755e)