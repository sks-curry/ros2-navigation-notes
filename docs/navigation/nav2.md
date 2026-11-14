# Nav2 导航

> 当前环境已确认：ROS 2 Humble。优先完成单点导航、Python 三点巡航，再接语义目标；A* 插件为研究支线。参阅 [Humble：VLN 与底层衔接](/vln/humble-integration)。跨版本教程仅参考概念，API 和参数以 Humble 分支为准。

### 第 3 周｜Nav2 基线

- [ ] 运行 Nav2，使用 RViz 设置目标点。
- [ ] 查看全局路径、本地代价地图、障碍物膨胀与速度命令。
- [ ] 理解 Planner 负责规划路径、Controller 根据路径和局部环境生成运动命令。
- [ ] 固定规划器及地图，比较 DWB 与 RPP 的跟踪行为。
- [ ] 在开阔区域与狭窄通道各做一次记录。

验收：解释“目标点 → 规划器 → 控制器 → 速度命令”的流程。实验中每次只改一个主要因素。

资料：[Nav2 官方仓库](https://github.com/ros-navigation/navigation2/tree/humble)；[Nav2 配置指南](https://docs.nav2.org/jazzy/configuration_and_development/configuration_guide/)；[Nav2 插件列表](https://docs.nav2.org/jazzy/configuration_and_development/navigation_plugins/)。

