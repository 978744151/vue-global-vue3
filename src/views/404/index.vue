<template>
  <div class="error404">
    <div class="error404-body-con">
      <div class="box-card ">
        <img class="center flex justify-center mb-2" style="margin: 0 auto" src="@/static/images/404.jpg" alt="">
        <!-- <div class="error404-body-con-title">404</div> -->
        <div class="error404-body-con-message">无权访问此页面 请检查网页链接或联系管理员</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const backPage = () => {
  router.go(-2)
}
</script>
<style lang="scss" scoped>
@keyframes error404animation {
  0% {
    transform: rotateZ(0deg);
  }

  20% {
    transform: rotateZ(-60deg);
  }

  40% {
    transform: rotateZ(-10deg);
  }

  60% {
    transform: rotateZ(50deg);
  }

  80% {
    transform: rotateZ(-20deg);
  }

  100% {
    transform: rotateZ(0deg);
  }
}

.error404 {
  &-body-con {
    // width: 700px;
    // height: 500px;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);

    &-title {
      text-align: center;
      font-size: 100px;
      font-weight: 700;
      // color: #2d8cf0;
      height: 260px;
      line-height: 260px;
      margin-top: 40px;

      span {
        display: inline-block;
        color: #19be6b;
        font-size: 60px;
        // animation: error404animation 3s ease 0s infinite alternate;
      }
    }

    &-message {
      display: block;
      text-align: center;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: 12px;
      color: #dddde2;
    }
  }

  &-btn-con {
    text-align: center;
    padding: 20px 0;
    margin-bottom: 40px;
  }
}
</style>
