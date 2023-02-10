<!--
 * @Author: Soulmate
 * @Date: 2022-12-27 09:14:49
 * @LastEditTime: 2023-02-10 11:42:12
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\views\laboratory\seata\index.vue
 * 版权声明
-->
<!-- setup 无法设置组件名称，组件名称keepAlive必须 -->
<script lang="ts">
export default {
  name: "user",
};
</script>

<script setup lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import {
  Vector2,
  Raycaster,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  Scene,
  PerspectiveCamera,
  WebGL1Renderer,
  AmbientLight,
  CubeTextureLoader,
  Mesh,
  PlaneGeometry,
  MeshLambertMaterial,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const loading = ref(true);

let scene: any = new Scene();

const environment = ref<HTMLDivElement>();

/**
 * 默认场景
 */
const nameDefault = ref<string>("indoor");

/**
 * 切换场景事件
 */
const changeName = (environmentName: string) => {
  if (nameDefault.value === environmentName) {
    return;
  }
  if (environmentName === "") {
    environmentName = nameDefault.value;
  }
  loading.value = true;
  scene.background = new CubeTextureLoader()
    .setPath(`/src/assets/threeImg/${environmentName}/`)
    .load(
      ["posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"],
      function () {
        loading.value = false;
        nameDefault.value = environmentName;
      }
    );
};

/**
 * 初始化
 */
const init = () => {
  loading.value = true;
  /**
   * 相机 PerspectiveCamera(视野大小, 视图的长宽比, 近景， 远景)
   */
  console.log(window, "window");
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 300);
  camera.lookAt(scene.position);

  /**
   * antialias消除锯齿
   */
  const renderer = new WebGL1Renderer({ antialias: true });
  // 背景颜色
  renderer.setClearColor(0xffffff);
  // 设置设备像素比
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  /**
   * 添加环境灯光
   */
  scene.add(new AmbientLight(0xffffff, 2));

  environment.value?.appendChild(renderer.domElement);

  const planeGeometry = new PlaneGeometry(60, 20);
  // 材质 MeshBasicMaterial和MeshLambertMaterial的区别 MeshLambertMaterial它不会 自己发光,而是需要一个光源照射
  const planeMaterial = new MeshLambertMaterial({ color: 0xcccccc });
  // 用来定位音源的网格模型
  const audioMesh = new Mesh(planeGeometry, planeMaterial);
  // 设置网格模型的位置，相当于设置音源的位置
  audioMesh.position.set(0, 0, 300);
  scene.add(audioMesh);

  window.addEventListener("resize", () => onWindowResize());

  /**
   * 轨道控制器 也就是鼠标转动等操作
   */
  let orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.autoRotateSpeed = 1;
  orbitControls.minDistance = 50;
  //缩放倍数
  // orbitControls.zoomSpeed = 1.0;

  renderScene();
  function renderScene() {
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }

  const onWindowResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  // 创建热点
  const url = `/src/assets/hot.png`;
  const hotPoints = [
    {
      position: {
        x: 0,
        y: 0,
        z: 300,
      },
      detail: {
        name: 'outdoor',
        title: "这是卧室",
      },
    },{
      position: {
        x: 0,
        y: 300,
        z: 0,
      },
      detail: {
        name: 'indoor',
        title: "这是厨房",
      },
    },
  ];
  let poiObjects = [] as any;
  const material = new SpriteMaterial({
    map: new TextureLoader().load(url),
    color: 0xffffff,
  });
  material.rotation = Math.PI;
  for (let i = 0; i < hotPoints.length; i++) {
    const sprite = new Sprite(material) as any;
    sprite.position.set(
      hotPoints[i].position.x,
      hotPoints[i].position.y,
      hotPoints[i].position.z
    );
    sprite.scale.set(10, 10, 10);
    // 添加指示语
    sprite.detail = hotPoints[i].detail.title;
    sprite.name = hotPoints[i].detail.name;
    poiObjects.push(sprite);
    scene.add(sprite);
  }
  console.log(scene)
  addClick();
  function addClick() {
    window.addEventListener("click", clickFunc); //页面绑定鼠标点击事件
    //点击方法
    function clickFunc(e: any) {
      var raycaster = new Raycaster(); //光线投射，用于确定鼠标点击位置
      var mouse = new Vector2(); //创建二维平面
      //将html坐标系转化为webgl坐标系，并确定鼠标点击位置
      mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY / renderer.domElement.clientHeight) * 2) + 1;
      //以camera为z坐标，确定所点击物体的3D空间位置
      raycaster.setFromCamera(mouse, camera);
      //确定所点击位置上的物体数量
      var intersects = raycaster.intersectObjects(poiObjects);
      //选中后进行的操作
      if (intersects.length) {
        console.log("选中了");
        changeName(intersects[0].object.name);
      }
    }
  }
};

onMounted(() => {
  init();
  changeName("");
});
</script>

<template>
  <div v-loading="loading" style="position: relative">
    <div
      style="
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0.5;
        height: 35px;
        width: 100%;
        z-index: 9999;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 20px;
      "
    >
      <el-button size="default" @click="changeName('indoor')">室内</el-button>
      <el-button size="default" @click="changeName('outdoor')">室外</el-button>
    </div>
    <div ref="environment"></div>
  </div>
</template>

<style lang="scss" scoped></style>
