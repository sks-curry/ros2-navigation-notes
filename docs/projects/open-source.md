# 开源项目与学习顺序

> 当前环境已确认：ROS 2 Humble。优先完成单点导航、Python 三点巡航，再接语义目标；A* 插件为研究支线。参阅 [Humble：VLN 与底层衔接](/vln/humble-integration)。跨版本教程仅参考概念，API 和参数以 Humble 分支为准。

## 五、开源项目学习方法

1. 先看 README：任务、ROS 版本、仿真或真机、传感器、GPU、安装步骤和许可证。
2. 固定可复现环境，记录发行版、分支 / commit 和依赖。
3. 跑通作者最小示例，记录运行命令和结果；失败先解决版本、依赖与驱动。
4. 从 launch 进入，找到 YAML、节点、订阅与发布的话题、消息类型与坐标系。
5. 只选择一条关键数据流深入，例如“目标点 → 规划器 → 路径”。
6. 每次修改一个参数或模块，对比运行结果，画出自己的数据流图。
7. 记录项目可复用部分与不能直接使用的假设；查论文确认方法与代码对应关系。

复盘模板：项目 / commit；环境；目标；输入与输出；运行命令；修改；结果；报错及解决方法；下次要验证的问题。



## 七、开源项目学习顺序与验收

按同一仿真平台贯通，不要把每个仓库理解为都需完整部署。时间与前面的 8 周任务重叠。

| 顺序 | 对应时间 | 项目与方式 | 交付与继续条件 |
| --- | --- | --- | --- |
| 1 | 第 1 周 | [ros2/examples](https://github.com/ros2/examples)：运行并改写 Python、C++ 发布与订阅示例 | 写一个发布、订阅节点，能用命令查看话题 |
| 2 | 第 1–2 周 | [Nav2 最小 TurtleBot 仿真](https://github.com/ros-navigation/nav2_minimal_turtlebot_simulation)：按发行版选分支；或选匹配版本的 [TurtleBot3 仿真](https://github.com/ROBOTIS-GIT/turtlebot3_simulations) | 启动 Gazebo / RViz，观察雷达、里程计和 TF |
| 3 | 第 2 周 | [SLAM Toolbox](https://github.com/SteveMacenski/slam_toolbox)：在步骤 2 的机器人上运行建图；[官方 SLAM 教程](https://docs.nav2.org/lyrical/tutorials/general_tutorials/navigation2_with_slam/navigation2_with_slam/) | 保存并加载地图，完成 AMCL 定位 |
| 4 | 第 3 周 | [Nav2](https://github.com/ros-navigation/navigation2/tree/humble)：[Jazzy 快速入门](https://ros-navigation.github.io/mkdocs.nav2.org/jazzy/getting_started/quickstart/quickstart/) | 点到点导航；看路径、代价地图和速度；比较 DWB / RPP |
| 5 | 第 4 周 | [Linorobot2](https://github.com/linorobot/linorobot2) 或实际机器人厂商仓库：重点读底盘、通信、里程计、雷达和 launch | 有兼容硬件：低速完成短距离真机导航；否则先阅读接口并继续仿真 |
| 6 | 第 5 周 | [PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics)：只学 A\* 路径规划示例 | 说清 open / closed、代价函数，自己在栅格地图实现 A\* |
| 7 | 第 5–6 周 | [Nav2 Jazzy 自定义规划器教程](https://ros-navigation.github.io/mkdocs.nav2.org/jazzy/tutorials/plugin_tutorials/writing_new_planner_plugin/writing_new_planner_plugin/)：学习直线规划插件 | 编译加载插件；掌握接口、注册及 YAML 配置 |
| 8 | 第 6–7 周 | 自建导航包：结合论文及步骤 6–7，接入自定义规划方法 | 固定地图、起终点和控制器，完成仿真对比；有条件再做真机重复实验 |
| 9 | 第 8 周 | [Semantic-nav-amr](https://github.com/Gukdoli/Semantic-nav-amr)：阅读语言、视觉、目标坐标与 Nav2 对接 | 先做文字 → 目标识别 → 可通行目标点 → Nav2 的仿真原型；项目自述依赖 Humble / 特定机器人和相机 |
| 10 | 后续进阶 | [VLN-CE](https://github.com/jacobkrantz/VLN-CE)：研究 Habitat 数据集、模型及评测；[VLN Sim2Real](https://github.com/batra-mlp-lab/vln-sim2real) 阅读仿真到真机方法 | 区分语义目标导航与多步骤 VLN；后者使用旧 ROS 版本，不可当作现成 ROS 2 工程 |

说明：先按手头机器人和驱动固定 ROS 2 版本，核对每个仓库支持的分支、Gazebo、硬件和计算条件。上述时间均为参考；论文创新、完整 VLN 和真机部署耗时取决于基础与平台条件。

[Ubuntu 22.04 + ROS 2 Humble 常用命令知识库｜Linux · ROS 2 · Nav2 · 排错](https://app.notion.com/p/416e4d9d57e6810181bbdf338943755e)