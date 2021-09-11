<template>
  <div class="m-checkout">
    <FullLoading v-if="isLoadingPage" />
    <FullError v-if="!isLoadingPage && isLoadFailed" @refresh="init" />
    <div v-show="!isLoadingPage && !isLoadFailed">
      <div class="header">
        <span class="label">实付金额</span>
        <span class="price text-red">
          <span v-if="isFromIosReview">晓币</span>
        <span v-else>¥</span>
        {{order.pay_amount}}</span>
      </div>
      <div class="payment">
        <div class="payment-item" @click="onClickChoose('wx')">
          <div class="type"><span class="xiaoicon wx">&#xe633;</span>微信支付</div>
          <div class="tag">
            <span v-if="chosen === 'wx'" class="xiaoicon active">&#xe61b;</span>
            <span v-else class="xiaoicon disabled">&#xe615;</span>
          </div>
        </div>
        <!-- <div class="payment-item" @click="onClickChoose('ali')" v-if="!$UA.weixin"> -->
        <div class="payment-item" @click="onClickChoose('ali')">
          <div class="type"><span class="xiaoicon zfb">&#xe63c;</span>支付宝支付</div>
          <div class="tag">
            <span v-if="chosen === 'ali'" class="xiaoicon active">&#xe61b;</span>
            <span v-else class="xiaoicon disabled">&#xe615;</span>
          </div>
        </div>
        <div class="payment-item" @click="onClickChoose('bank')">
          <!-- <div class="type"><span class="xiaoicon apple">&#xe644;</span>银行转账</div> -->
          <div class="type"><img src="~src/images/bank_pic@2x.png" alt="">银行转账</div>
            <div class="tag">
              <span v-if="chosen === 'bank'" class="xiaoicon active">&#xe61b;</span>
              <span v-else class="xiaoicon disabled">&#xe615;</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="btn-back btn-checkout" @click="goToOrderDetail">
            <span>返回订单页面</span>
          </div>
          <div class="btn btn-basic btn-checkout" @click="onClickCheckout">
            <span class="xiaoicon" v-if="isHandlingPayment">&#xe637;</span>
            <span v-else>确认支付</span>
          </div>
          <p>请在<span class="text-green">{{minutes}}</span>分<span class="text-green">{{seconds}}</span>秒内支付，否则订单取消</p>
        </div>
      </div>
      <!-- modal -->
      <div class="modal" v-show="$UA.weixin && modalVisible" @click="modalVisible = false">
        <img class="browser" src="~src/images/order_bg_1@2x.png" v-if="isIos" />
        <img class="browser" src="~src/images/order_bg_2@2x.png" v-else />
    </div>
      </div>
</template>
<script>
import Vue from 'vue'
import FullLoading from 'components/FullLoading.vue'
import FullError from 'components/FullError.vue'
import message from 'src/components/Message/message'
import enumOrder from 'src/enum/vip-order.json'
import { pad } from 'xiao-utils/lang'
import {
  api_getOrderStatus,
  api_wxpay,
  api_wxpayAuth,
  api_alipayCheckout
} from 'src/api/vip/order'
import { setTicker, clearTicker } from 'xiao-utils/ticker'
import { getRedirectHost } from 'utils/host'

const WECHAT_QRCODE = 1,
  WECHAT_JS = 2,
  WECHAT_H5 = 3

export default {
  components: {
    FullLoading,
    FullError
  },
  data() {
    return {
      isFromIosReview: localStorage.getItem('isFromIosReview'),
      go: false,
      chosen: 'wx',
      isLoadFailed: false,
      messageVm: null,
      isLoadingPage: true,
      isHandlingPayment: false,
      countdown: 0,
      order: {
        order: {},
        student: {},
        pay: {}
      },
      modalVisible: false,
      isIos: false
    }
  },
  computed: {
    orderNum() {
      return this.$route.params.orderNum
    },
    minutes() {
      return pad(Math.floor(this.countdown / 60))
    },
    seconds() {
      return pad(this.countdown % 60)
    }
  },
  methods: {
    startCountdown() {
      this.timer_ = setTicker(() => {
        console.log('ticking')
        this.countdown -= 1
        if (this.countdown <= 0) {
          clearTicker(this.timer_)
          this.jumpToOrderDetail()
        }
      }, 1000)
    },
    // 订单详情
    getOrderStatus() {
      const params = {
        order_num: this.orderNum
      }
      return api_getOrderStatus(params).then(res => {
        this.order = res.data
        return res
      })
    },
    getCheckoutDetail() {
      this.isLoadingPage = true
      this.isLoadFailed = false
      this.getOrderStatus()
        .then(res => {
          if (res.data.status !== enumOrder.orderStatus.ORDERED) {
            this.jumpToOrderDetail()
            return false
          }
          this.countdown = parseInt(res.data.valid_seconds)
          this.startCountdown()
          this.isLoadingPage = false
        })
        .catch(err => {
          this.isLoadingPage = false
          this.isLoadFailed = true
        })
    },
    onClickChoose(type) {
      this.chosen = type
    },
    // "确认支付"
    onClickCheckout() {
      if (this.isHandlingPayment) {
        return false
      }
      if (this.chosen === '') {
        this.$xiaoToast.warning('请选择支付方式')
        return false
      }
      /* if(this.$UA.weixin) {
        this.jsCheckout()
      } else {
        this.h5Checkout()
      } */
      if (this.chosen === 'ali') {
        if (this.$UA.weixin) {
          this.modalVisible = true;
          return;
        }
        this.alipayCheckout()
      } else if (this.chosen === 'bank') {
        this.$router.push({
          name: 'Bank',
          params: {
            orderNum: this.orderNum
          }
        })
      } else if (this.chosen === 'wx') {
        if (this.$UA.weixin) {
          this.jsCheckout()
        } else {
          this.h5Checkout()
        }
      }
    },
    // 跳转:订单详情
    jumpToOrderDetail() {
      this.go = true
      this.$router.replace({
        name: 'VipOrderDetail',
        params: {
          orderNum: this.orderNum
        }
      })
    },
    // 返回订单页
    goToOrderDetail() {
      let ret = {
        name: 'VipOrderDetail',
        params: { orderNum: this.orderNum }
      }
      if (this.$route.query.other_pay_key) {
        ret.query = {
          other_pay_key: this.$route.query.other_pay_key
        }
      }
      this.go = true
      this.$router.replace(ret)
    },
    // 跳转:支付成功
    jumpToOrderSuccess() {
      this.go = true
      this.$router.replace({
        name: 'VipOrderSuccess',
        params: {
          orderNum: this.orderNum
        }
      })
    },
    // 确认离开
    showConfirm(next) {
      let self = this

      function ok() {
        self.messageVm = null
        self.go = true
        next({
          name: 'VipOrderDetail',
          params: {
            orderNum: self.orderNum
          }
        })
      }

      function cancel() {
        self.messageVm = null
        next(false)
      }
      this.messageVm = message({
        title: '取消支付',
        content: `超过支付时效后订单将被自动取消\n请尽快完成支付`,
        okText: '放弃支付',
        cancelText: '继续支付',
        onOk: ok,
        onClose: cancel
      })
    },
    // h5调起微信支付
    h5Checkout() {
      this.isHandlingPayment = true
      const order_num = this.orderNum
      const scene_info = {
        "h5_info": {
          "type": "Wap",
          "wap_url": "https://m.xhwx100.com",
          "wap_name": "星火网校"
        }
      }
      const redirectHost = getRedirectHost()
      const params = {
        order_num,
        payment_method: WECHAT_H5,
        h5: {
          redirect_url: `${redirectHost}/order/vip-success/${order_num}`,
          scene_info: JSON.stringify(scene_info)
        }
      }

      api_wxpay(params)
        .then(res => {
          const { url } = res.data.h5
          location.replace(url)
        })
        .catch(err => {
          this.isHandlingPayment = false
          this.$xiaoToast.warning('无法调起微信支付，请在微信内打开')
        })
    },
    // 微信内调起支付
    jsCheckout() {
      const self = this
      this.isHandlingPayment = true
      const params = {
        order_num: this.orderNum,
        payment_method: WECHAT_JS,
        no_publish: {
          code: this.$route.query.code
        }
      }
      if (this.$route.query.other_pay_key) {
        params.other_pay_key = this.$route.query.other_pay_key
      }
      api_wxpay(params)
        .then(res => {
          const { json_request } = res.data.no_publish

          function onBridgeReady() {
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest',
              JSON.parse(json_request),
              function(res) {
                if (res.err_msg === "get_brand_wcpay_request:ok") {
                  self.jumpToOrderSuccess()
                } else if (res.err_msg === "get_brand_wcpay_request:fail") {
                  self.isHandlingPayment = false
                  self.$xiaoToast.warning('支付失败！')
                } else {
                  self.isHandlingPayment = false
                }
              }
            )
          }
          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
            }
          } else {
            onBridgeReady()
          }
        })
        .catch(err => {
          this.isHandlingPayment = false
          this.$xiaoToast.warning('调起微信支付失败！')
        })
    },
    /** 支付宝支付 */
    alipayCheckout() {
      const redirectHost = getRedirectHost()
      let redirect_url = `${redirectHost}/order/vip-success/${this.order.order_num}`
      if (this.$route.query.pid) {
        redirect_url += `?pid=${this.$route.query.pid}`
      }
      const params = {
        order_num: this.orderNum,
        redirect_url
      }
      if (this.$route.query.other_pay_key) {
        params.other_pay_key = this.$route.query.other_pay_key
      }
      this.isHandlingPayment = true
      api_alipayCheckout(params)
        .then(res => {
          window.location.href = res.data.alipay_url
        })
        .catch(() => {
          this.isHandlingPayment = false
          this.$xiaoToast.warning('调起支付失败')
        })
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!Vue.prototype.$UA.weixin) {
      next()
    } else {
      if (to.query.code) {
        next()
      } else {
        const REDIRECT_FILE_ADDRESS = __WECHAT_PAY_OAUTH__
        const goBackHost = getRedirectHost()
        const next = `${goBackHost}${to.fullPath}`
        const redirect_uri = encodeURIComponent(`${REDIRECT_FILE_ADDRESS}?next=${encodeURIComponent(next)}`)
        const params = {
          redirect_uri
        }
        api_wxpayAuth(params)
          .then(res => {
            window.location.href = res.data.oauth
          })
          .catch(() => {
            Vue.prototype.$xiaoToast.warning('获取授权失败')
          })
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'login') {
      next()
      return
    }
    if (this.go === true) {
      next()
      return
    }
    if (this.messageVm) {
      this.messageVm && this.messageVm.close()
      this.messageVm = null
    }
    // this.showConfirm(next)
    if (to.name === 'Bank') {
      next()
    } else {
      this.showConfirm(next)
    }
  },
  created() {
    // this.getCheckoutDetail()
  },
  mounted() {
    let ua = navigator.userAgent.toLowerCase();
    this.isIos = (ua.search(/iphone/) != -1);
    this.getCheckoutDetail()
  },
  destroyed() {
    if (this.timer_) {
      clearTicker(this.timer_)
      this.timer_ = null
    }
  }

}

</script>
<style lang="scss" scoped>
.m-checkout {
  background: #f7f8fc;

  .header {
    .label {
      color: #363740;
    }

    .text-red {
      color: #FF4C5E;
    }
  }

  .payment {
    .payment-item {
      color: #363740;
      padding: 0;
      margin: 0 0.533333rem 0 0.4rem;

      &:not(:last-child) {
        border-bottom: 1px solid #EBEBEB;
      }

      img {
        width: 0.66667rem;
        height: 0.51733rem;
        margin-right: 0.306667rem;
      }

      .tag {
        .active {
          color: #5F74FF;
        }
      }
    }
  }

  .footer {
    color: #9CA0B2;
    box-shadow: 0 -1px 0 0 #E6E6E6;

    .btn-back {
      border: 1px solid #DDDEE8;
      border-radius: 3px;
      color: #5F74FF;
    }

    .btn-basic {
      background: #5F74FF;
    }
  }

  .text-green {
    color: #5F74FF;
  }
}

.modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
  background: #000000;

  .browser {
    position: absolute;
    top: 0.3rem;
    right: 0.53333rem;
    width: 6.92rem;
    height: 2.56rem;
  }
}

</style>
