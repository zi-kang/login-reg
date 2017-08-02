/**
 * Created by huang on 07/07/2017.
 */
var region = '//passport.sightp.com/';
var topRef = '';

var template =
    '<div class="valid-code">' +
    '<div class="slider_hint"><i class="icon-valid" :class="{iconValidSuccess:state}"></i><a href="javascript:void(0);" style="color:#50bd6b" @click="showValid">{{tipTitle}}</a></div>' +
    '<div class="slider_main" v-if="isShow">' +
    '<div style="text-align: left;text-indent: 20px;"><span :class="{tipSuccess:state,tipFailed:state===false,tiphint:state===null}">{{title}}</span><i style="float: right;margin-right: 20px;" class="icon-refresh" @click="getCodeMask"></i></div>' +
    '<div class="mask-box"><div class="mask-module"><img id="mask" :src="mask.src"><img id="maskCode" :src="maskCode" :style="{left:maskLeft,top:maskTop}"></div></div>' +
    '<div></div>' +
    '<vueSlider style="margin:0 auto" :width="325" :tooltip="false" :max="252" v-model="mask.x" @drag-start="clear" @drag-end="valid"></vueSlider>' +
    '</div>' +
    '</div>';
Vue.component('valid-code', {
    template: template,
    props: [],
    data: function () {
        return {
            state: null,//null => 未验证，true => 已验证 ，false =>验证未通过
            mask: {
                src: null,
                x: 0,
                y: 0
            },
            codeKey: null,
            maskCode: null,
            isShow :false
        }
    },
    computed: {
        title: function () {
            var state = this.state;
            if (state === null) {
                return '按住滑块，拖动完成拼图'
            }
            if (state) {
                return '验证成功'
            }
            if (!state) {
                return '验证失败,请重新验证'
            }
        },
        maskLeft: function () {
            return this.mask.x + 'px'
        },
        maskTop:function () {
            return this.mask.y + 'px'
        },
        tipTitle:function () {
            var state = this.state;
            if (state){
                return '验证成功';
            }else{
                return '点击完成验证'
            }
        }
    },
    components: {
        'vueSlider': window['vue-slider-component']
    },
    watch:{
      isShow:function () {
          if (this.isShow){
              this.getCodeMask();
          }
      }
    },
    methods: {
        showValid:function () {
            this.isShow = !this.isShow;
        },
        getCodeMask: function () {
            var url = region + 'v4/captcha';
            var _this = this;
            $.get(url).always(function (response) {
                if (response.errorCode == '0') {
                    var src = response.result.image,
                        x = response.result.x,
                        y = response.result.y,
                        code = response.result.code;
                    _this.mask.x = x;
                    _this.mask.y = y;
                    _this.mask.src = src;
                    _this.codeKey = code;
                    _this.maskCode = '//staticfile-cdn.sightp.com/images/validator/mask.png';
                }
            });
        },
        clear:function () {
            this.state = null;
        },
        valid: function () {
            var param = {
                    type:'POST',
                    url: region+'v4/captcha',
                    data: {
                        code: this.codeKey,
                        x: this.mask.x,
                        y: this.mask.y
                    }
                }
            ;
            var _this = this;
            $.ajax(param).always(function (response) {
                if (response.errorCode == '0'){
                    _this.state = true;
                    _this.$emit('valid-success',[{code:_this.$data.codeKey,x:_this.$data.mask.x,y:_this.$data.mask.y}]);
                    setTimeout(function () {
                        _this.isShow = false;
                    },1000)
                }else{
                    _this.state = false;
                    _this.getCodeMask();
                }
            })
        }

    }
});
