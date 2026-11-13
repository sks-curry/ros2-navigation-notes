# 真机导航

### 第 4 周｜真机底层与导航

- [ ] 核对底盘型号、通信方式、雷达、编码器、IMU 与现有驱动。
- [ ] 单独验证电机正反转、速度方向、编码器、里程计及雷达。
- [ ] 检查 map → odom → base_link → 传感器的 TF，避免重复发布同一变换。
- [ ] 遥控建图，加载地图并定位，再做短距离 Nav2 导航。
- [ ] 配置可用急停、速度限制、命令超时停车；空旷场地低速测试。

理解：Nav2 给出机器人线速度 v 和角速度 ω，底盘驱动将其转换成轮速，下位机结合编码器控制电机。差速轮机器人轮距 L 时：v_L = v − ωL/2，v_R = v + ωL/2。

资料：[Nav2 新机器人配置指南](https://docs.nav2.org/rolling/configuration_and_development/first_time_robot_setup_guide/)；[Linorobot2](https://github.com/linorobot/linorobot2)；[TurtleBot3](https://github.com/ROBOTIS-GIT/turtlebot3)。

