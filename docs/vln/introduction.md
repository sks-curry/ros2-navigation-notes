# 视觉语言导航（VLN）

### 第 8 周｜VLN / 语义导航原型

- [ ] 输入“去椅子旁”，先提取目标类别。
- [ ] 相机检测目标，结合深度、相机内参与 TF 估计位置。
- [ ] 在物体附近选择可通行、留有距离的目标位姿，发送给 Nav2。
- [ ] 处理无深度、识别失败、不可达、导航超时等情况。
- [ ] 将目标点、图像和导航结果保存，分析误差来源。

这是单目标语义导航原型；完整 VLN 通常还涉及多步骤指令、场景记忆、探索和评测，不应将简单目标检测直接等同于完整 VLN。模型可能输出全局目标、局部航点、离散动作或速度，需要分别编写适配接口。

资料：[Semantic-nav-amr](https://github.com/Gukdoli/Semantic-nav-amr)（ROS 2 语义导航参考；核对依赖）；[VLN-CE](https://github.com/jacobkrantz/VLN-CE)（Habitat 仿真基准，非开箱即用 ROS 2 真机包）；[VLN sim2real](https://github.com/batra-mlp-lab/vln-sim2real)（早期 ROS 项目，借鉴迁移思路）；[SysNav-CMU-VLN](https://github.com/yuezhiyuanting/SysNav-CMU-VLN)（较复杂，计算配置要求较高）。

