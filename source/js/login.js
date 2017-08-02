/**
 * Created by huang on 05/07/2017.
 */
var region = '//passport.sightp.com/';
var topRef = '';

var tem_login = `<div>
<h4>账号登录</h4>
        <div class="child-modal">
            <div class="tip"
                 :class="{success:!tip.isError,error:tip.isError}"
                 v-if="tip.show">
                <i class="icon"
                   :class="{success:!tip.isError,error:tip.isError}"></i>{{tip.message}}
            </div>
            <input type="text" placeholder="请输入用户名/手机号"
                   @blur="validUser"
                   @focus="clean"
                   @keyup.enter="login"
                   v-model="username">
            <input type="password" placeholder="请输入登录密码"
                   @blur="validPwd"
                   @focus="clean"
                   @keyup.enter="login"
                   v-model="password">
            <div class="valid-cap clearfix"
                 v-if="captcha.show">
                <input type="text" maxlength="6" placeholder="请输入验证码"
                       @keyup.enter="login"
                       v-model="code">
                <img :src="captcha.src"
                     @click="reloadCode">
            </div>
            <button @click="login">{{txt}}</button>
            <div class="other">
                <a href="./register.html">免费注册</a>
                <a href="./findpwd.html">忘记密码？</a>
            </div>
        </div>
</div>`;
Vue.component('sightp-login', {
    template: tem_login,
    data: function () {
        return {
            captcha: {
                show: false,
                src: '//passport.sightp.com/captcha/image',
            },
            state1: false,//用户名状态
            state2: false,//密码状态
            username: '',
            password: '',
            code: '',
            tip: {
                show: false,
                message: '',
                isError: ''
            },
            button: false,//登录按钮状态，false => 未点击 true => 已点击，等待完成。
        }
    },
    computed: {
        txt: function () {
            return this.button ? '登录中...' : '登录';
        },
    },
    methods: {
        reloadCode: function () {
            this.captcha.src = '//passport.sightp.com/captcha/image' + '?=' + (new Date()).getTime();
        },
        validUser: function () {
            if (this.username === ''){
                this.state1 = false;
                this.tip.show = true;
                this.tip.message = '请输入用户名或手机号';
                this.tip.isError = true;
                return false;
            }
            var reg1 = /^[\S\s]{3,20}$/;
            var valid1 = reg1.test(this.username);
            if (valid1) {
                this.state1 = true;
            } else {
                this.state1 = false;
                this.tip.show = true;
                this.tip.message = '用户名或手机号不正确';
                this.tip.isError = true;
            }
        },
        validPwd: function () {
            if (this.password === '') {
                this.state2 = false;
                this.tip.show = true;
                this.tip.message = '请输入密码';
                this.tip.isError = true;
                return false;
            }
            var reg2 = /^[\S\s]{6,20}$/;
            var valid2 = reg2.test(this.password);
            if (valid2) {
                this.state2 = true;
            } else {
                this.state2 = false;
                this.tip.show = true;
                this.tip.message = '密码格式错误';
                this.tip.isError = true;
            }
        },
        clean: function () {
            this.tip.show = false;
            this.tip.message = '';
            this.tip.isError = false;
        },
        login: function () {
            if (!this.state1) {
                this.validUser();
            }else if (!this.state2){
                this.validPwd();
            }
            if (this.state1 && this.state2) {
                this.button = true;
                var data1 = {
                    type: 'POST',
                    url: region + 'v4/login',
                    data: {
                        username: this.username,
                        password: this.password
                    }
                };
                var data2 = {
                    type: 'POST',
                    url: region + 'v4/login',
                    data: {
                        username: this.username,
                        password: this.password,
                        code: this.code
                    }
                };
                var param = this.captcha.show ? data2 : data1;
                var _this = this;

                function success(response) {
                    _this.$data.tip.show = true;
                    _this.$data.tip.message = '登录成功，跳转中...';
                    _this.$data.tip.isError = false;

                    response.result.forEach(function (item) {
                        var script = $('<script>').attr('src', item);
                        $('body').append(script);
                    });
                    _this.$data.button = true;
                    window.topRef = '//console.sightp.com';
                    setTimeout(function () {
                        _this.$data.button = false;
                        _this.$data.tip.show = false;
                        _this.$data.tip.message ='';
                        _this.$data.tip.isError = false;
                        window.location.href = '//console.sightp.com';
                    }, 1000);
                }

                function failed(response) {
                    _this.$data.tip.show = true;
                    _this.$data.tip.message = response.errorMessage.errorMessage;
                    _this.$data.tip.isError = true;

                    _this.$data.button = false;
                    _this.$data.captcha.show = response.errorMessage.showCaptcha;
                    _this.$data.captcha.src = '//passport.sightp.com/captcha/image' + '?=' + (new Date()).getTime();
                    _this.$data.code = ''
                }

                $.ajax(param).always(function (data) {
                    if (data.errorCode == '0') {
                        success(data);
                    } else {
                        failed(data);
                    }
                })
            }
        }
    }
});
window.onload = function () {
    var sightpLogin = new Vue({
        el: '#login',
    });
};
