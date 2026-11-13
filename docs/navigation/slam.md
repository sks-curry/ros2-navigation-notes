# SLAM 与定位

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

