/**
 * Created by huang on 05/07/2017.
 */
var tem_fpwd = `
        <div>
            <div>
                <h4>重置密码</h4>
                <div class="fpwd-main" v-if="findState === 1">
                    <div class="wrap-text" :class="{isEditing:edit === 1,isError:mobile.state === false}">
                        <span>+86</span>
                        <input id="mobile" type="text" placeholder="请输入手机号码" maxlength="11"
                               v-model.trim="mobile.val"
                               @focus="focusClean(mobile)"
                               @focusout="focusout"
                               @focusin="focusin(1)"
                               @blur="validMobile">
                        <p class="tip">{{mobile.message}}</p>
                    </div>
                    <div class="wrap-text" :class="{isError:mask.state===false}">
                        <valid-code @valid-success="maskValid"></valid-code>
                    </div>
                    <div class="wrap-text" :class="{isEditing:edit === 2}">
                        <input id="code" type="text" placeholder="请输入验证码" maxlength="6"
                               v-model.trim="mobileCode.val"
                               @focus="focusClean(mobileCode)"
                               @focusout="focusout"
                               @focusin="focusin(2)"
                               @blur="validMobileCode">
                        <button @click="sendCode">{{mobileCode.button}}</button>
                        <p class="tip">{{mobileCode.message}}</p>
                    </div>
                    <button class="next" @click="next">下一步</button>
                </div>
            </div>
            <div class="f_modify" v-if="findState === 2">
                <div class="wrap-text" :class="{isEditing:edit === 3}">
                    <input type="password" placeholder="请输入新密码" autocomplete="off" maxlength="20"
                           v-model.trim="password.val"
                           @focus="focusClean(password)"
                           @focusout="focusout"
                           @focusin="focusin(3)"
                           @blur="validPwd">
                    <p class="tip">{{password.message}}</p>
                </div>
                <div class="wrap-text" :class="{isEditing:edit === 4}">
                    <input type="password" placeholder="请再次输入新密码" autocomplete="off" maxlength="20"
                           v-model.trim="cPassword.val"
                           @focus="focusClean(cPassword)"
                           @focusout="focusout"
                           @focusin="focusin(4)"
                           @blur="validConfirm">
                    <p class="tip">{{cPassword.message}}</p>
                </div>
                <button class="m_pwd" @click="modify">修改完成</button>
            </div>
            <div class="f_success" v-if="findState === 3">
                <i class="sightp_tip b_success"></i>
                <p>新密码设置成功</p>
                <a href="//console.sightp.com">前往AR管理工作台</a>
                <a href="//www.sightp.com">返回首页</a>
            </div>
            <div class="f_success" v-if="findState === 4">
                <i class="sightp_tip b_failed"></i>
                <p>新密码设置失败</p>
                <a href="javascript:void (0);" onclick="window.location.reload();">重新设置密码</a>
                <a href="//www.sightp.com">返回首页</a>
            </div>
        </div>`;
Vue.component('sightp-fpwd',{
    template:tem_fpwd,
    data:function () {
        return {
            findState: 1,
            edit: null,
            mobile: {
                val: '',
                state: null,
                message: ''
            },
            mask: {
                code: null,
                x: null,
                y: null,
                state: null
            },
            mobileCode: {
                val: '',
                state: null,
                message: '',
                button: '发送验证码',
                isClick: false
            },
            password:{
                val: '',
                state: null,
                message: ''
            },
            cPassword:{
                val: '',
                state: null,
                message: ''
            }

        }
    },
    methods: {
        focusClean: function (what) {
            what.message = '';
            what.state = null;
        },
        focusin: function (what) {
            this.edit = what;
        },
        focusout: function () {
            this.edit = null;
        },
        validMobile: function () {
            var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])*\d{8}$/;
            var valid = reg.test(this.mobile.val);
            if (valid) {
                var param = {
                    url: region + 'valid/check-mobile',
                    type: 'GET',
                    dataType: 'jsonp',
                    data: {
                        value: this.mobile.val
                    }
                };
                var _this = this;
                $.ajax(param).always(function (data) {
                    if (data.errorCode != '0') {
                        _this.$data.mobile.state = true;
                        _this.$data.mobile.message = '';
                    } else {
                        _this.$data.mobile.state = false;
                        _this.$data.mobile.message = '手机号尚未注册';
                    }
                });

            } else {
                this.mobile.state = false;
                this.mobile.message = '请输入正确的手机号';
            }
        },
        maskValid: function (data) {
            var mask = this.mask;
            mask.state = true;
            mask.x = data[0].x;
            mask.y = data[0].y;
            mask.code = data[0].code;
        },
        sendCode: function () {
            var mobile = this.mobile.state;
            var mask = this.mask.state;
            if (!mobile) {
                this.validMobile();
                return;
            }
            if (!mask) {
                this.mask.state = false;
                return;
            }
            var isClick = this.mobileCode.isClick;
            if (isClick) {
                return;
            }
            var param = {
                url: region + "v4/sms-password",
                type: "POST",
                data: {
                    mobile: this.mobile.val,
                    code: this.mask.code,
                    x: this.mask.x,
                    y: this.mask.y
                }
            };
            this.mobileCode.isClick = true;
            this.mobileCode.button = '发送中';
            var _this = this;
            $.ajax(param).always(function (response) {
                if (response.errorCode == '0') {
                    _this.mobileCode.message = '';
                    _this.mobileCode.state = true;
                    var count = 90;
                    var timer = setInterval(function () {
                        if (count <= 0) {
                            _this.mobileCode.isClick = false;
                            _this.mobileCode.button = '重新发送';
                            clearTimeout(timer);

                        } else {
                            _this.mobileCode.button = '重新发送(' + count + ')';
                            count--;
                        }

                    }, 1000);
                } else {
                    _this.mobileCode.message = response.errorMessage;
                    _this.mobileCode.state = false;
                    _this.mobileCode.button = '发送验证码';
                    _this.mobileCode.isClick = false;
                }

            })
        },
        validMobileCode: function () {
            var reg = /^[\s\S]{6}$/;
            var valid = reg.test(this.mobileCode.val);
            if (valid) {

                var param = {
                    url:region+'valid/check-forget-mobile-and-code',
                    type:'GET',
                    dataType:'jsonp',
                    data:{
                        value:this.mobileCode.val,
                        target:this.mobile.val
                    }
                };
                var _this = this;
                $.ajax(param).always(function (data) {
                    if (data.errorCode == '0'){
                        _this.$data.mobileCode.state = true;
                        _this.$data.mobileCode.message = '';
                    }else{
                        _this.$data.mobileCode.state = false;
                        _this.$data.mobileCode.message = data.errorMessage;
                    }
                });
            } else {
                this.mobileCode.state = false;
                this.mobileCode.message = '输入正确的手机验证码';
            }
        },
        next: function () {
            var mobile = this.mobile.state;
            var mask = this.mask.state;
            var mcode = this.mobileCode.state;
            if (!mobile) {
                this.validMobile();
            }
            if (!mask) {
                this.mask.state = false;
            }
            if (!mcode) {
                this.validMobileCode();
            }
            if (mobile && mask && mcode) {
                this.findState =2;
            }
        },
        validPwd:function () {
            var reg = /^[\s\S]{6,20}$/;
            var valid = reg.test(this.password.val);
            if (valid){
                this.password.state = true;
                this.password.message = '';
                if (this.cPassword.state !== null){
                    this.validConfirm();
                }
            }else{
                this.password.state = false;
                this.password.message = '密码为6-20位字符';
            }
        },
        validConfirm:function () {
            var reg = /^[\s\S]{6,20}$/;
            var valid = reg.test(this.cPassword.val);
            if (valid){
                if (this.password.val === this.cPassword.val){
                    this.cPassword.state = true;
                    this.cPassword.message = '';
                }else{
                    this.cPassword.state = false;
                    this.cPassword.message = '密码输入不一致';
                }
            }else{
                this.cPassword.state = false;
                this.cPassword.message = '密码为6-20位字符';
            }
        },
        modify:function () {
            if (!this.password.state){
                this.validPwd();
            }
            if (!this.cPassword.state){
                this. validConfirm();
            }
            if (this.password.state&&this.cPassword.state){
                var _this = this;
                var param = {
                    url:region+'v4/password',
                    type:'POST',
                    data:{
                        mobile:this.mobile.val,
                        code:this.mobileCode.val,
                        password:this.password.val
                    }
                };
                $.ajax(param).always(function (data) {
                    if (data.errorCode == '0'){
                        _this.findState = 3;
                    }else{
                        _this.findState = 4;
                    }
                });
            }
        }
    }
});
window.onload =function () {
    var fpwd = new Vue({
        el:'#findPwd'
    });
};
