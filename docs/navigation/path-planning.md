# 自定义路径规划

### 第 5–6 周｜自建导航包与论文方法

- [ ] 明确论文方法属于全局规划、局部控制、代价地图还是上层决策；画输入输出。
- [ ] 运行官方直线规划器插件，检查类接口、插件注册和 YAML。
- [ ] 在独立二维栅格上实现 A\*；验证障碍、无法到达和起终点边界。
- [ ] 按实际 ROS 2 发行版的 API 将自定义规划算法接入 Nav2。
- [ ] 在相同地图、起终点、控制器与速度约束下比较基线与自定义方法。
- [ ] 保存代码版本、参数、地图、日志和结果。

建议首先替换单一模块：保留定位、代价地图和控制器，仅比较全局规划器。算法有无创新应通过文献和对比判断。

资料：[编写规划器插件](https://docs.nav2.org/rolling/tutorials/plugin_tutorials/writing_new_planner_plugin/writing_new_planner_plugin/)；[编写控制器插件](https://docs.nav2.org/rolling/tutorials/plugin_tutorials/writing_new_controller_plugin/writing_new_controller_plugin/)；[PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics)。Rolling 教程接口可能不同于 Humble / Jazzy，请以所装版本源码与文档为准。

