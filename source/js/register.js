var tem_register =`
    <div>
    <h4>欢迎注册视+AR</h4>
        <div v-if="registerState === 1" class="re-child">
            <div class="re-type"><span><i :class="{selected:this.type === 1}"
                                          @click="selectType(1)"></i>个人用户</span><span><i
                    :class="{selected:this.type === 2}" @click="selectType(2)"></i>企业用户</span></div>
            <div class="border user" :class="{isEditing:edit === 1,isError:username.state===false}">
                <input type="text" placeholder="请设置用户名" maxlength="20"
                       @focusin="focusin(1)"
                       @focusout="focusout"
                       @blur="validUsername"
                       @focus="focusClean(username)"
                       v-model.trim="username.val">
                <p class="tip">{{username.message}}</p>
            </div>
            <div class="border user" :class="{isEditing:edit === 2,isError:password.state===false}">
                <input type="password" placeholder="请设置密码" maxlength="20"
                       @focusin="focusin(2)"
                       @focusout="focusout"
                       @blur="validPwd"
                       @focus="focusClean(password)"
                       v-model.trim="password.val">
                <p class="tip">{{password.message}}</p>
            </div>
            <div class="border user" :class="{isEditing:edit === 3,isError:confirmPwd.state===false}">
                <input type="password" placeholder="请再次输入密码" maxlength="20"
                       @focusin="focusin(3)"
                       @focusout="focusout"
                       @blur="validConfirmPwd"
                       @focus="focusClean(confirmPwd)"
                       v-model.trim="confirmPwd.val">
                <p class="tip">{{confirmPwd.message}}</p>

            </div>
            <div class="mobile border" :class="{isEditing:edit === 4,isError:mobile.state===false}">
                <span>+86</span><input type="text" placeholder="请输入手机号码" maxlength="11"
                                       @focusin="focusin(4)"
                                       @focusout="focusout"
                                       @blur="validMobile"
                                       @focus="focusClean(mobile)"
                                       v-model="mobile.val">
                <p class="tip">{{mobile.message}}</p>

            </div>
            <div class="border code" :class="{isEditing:edit === 5,isError:mask.state===false}">
                <valid-code @valid-success="maskValid" :class="{isError:mask.state===false}"></valid-code>
            </div>
            <div style="margin-bottom:40px;" class="border code" :class="{isEditing:edit === 6,isError:mobileCode.state===false}">
                <input type="text" placeholder="请输入验证码" maxlength="6"
                       @focusin="focusin(6)"
                       @focusout="focusout"
                       @focus="focusClean(mobileCode)"
                       @blur="validMobileCode"
                       v-model.trim="mobileCode.val">
                <button @click="sendCode">{{mobileCode.button}}</button>
                <p class="tip">{{mobileCode.message}}</p>
            </div>
            <div class="protocol">
                <i class="icon-agree"
                   @click="isAgree"
                   :class="{agreed:agree.state}"></i>我已阅读并同意<a href="//passport.sightp.com/agreement.html">视+服务协议</a>
                <p v-if="!agree.state" class="tip">需要勾选协议才能注册</p>

            </div>
            <p style="color:red;line-height: 25px;">{{errorMessage}}</p>
            <button class="register" @click="register">注册</button>
            <p class="others">已有账号，立即<a href="./login.html">登录</a></p>
        </div>
        <div v-if="registerState === 2" class="r_success">
            <i class="sightp_tip b_success"></i>
            <p>恭喜你，注册成功</p>
            <a href="javascript:void(0);" @click="login">前往AR管理工作台</a>
            <a href="//www.sightp.com">返回首页</a>
        </div>
        <div v-if="registerState === 3" class="r_failed">
            <i class="sightp_tip b_failed"></i>
            <p>注册失败，请稍后重试</p>
            <a href="./register.html">重新注册</a>
            <a href="//www.sightp.com">返回首页</a>
        </div>
</div>
`;

Vue.component('sightp-register',{
    template:tem_register,
    data:function(){
        return {
            errorMessage: '',
            registerState: 1,
            edit: null,
            type: 1,//用户类型
            username: {
                val: '',
                state: null,
                message: '',
            },//用户名
            password: {
                val: '',
                state: null,
                message: ''
            },//密码
            confirmPwd: {
                val: '',
                state: null,
                message: ''
            },//确认密码
            mobile: {
                val: '',
                state: null,
                message: ''
            },//手机号码
            mask: {
                code: null,
                x: null,
                y: null,
                state: null
            },//
            mobileCode: {
                val: '',
                state: null,
                message: '',
                button: '发送验证码',
                isClick: false
            },
            agree: {
                state: true
            }
        }
    },
    computed:{
        passed:function () {
            return  this.username.state&&
                this.password.state&&
                this.confirmPwd.state&&
                this.mobile.state&&
                this.mask.state&&
                this.mobileCode.state&&
                this.agree.state;
        }
    },
    methods: {
        focusin:function (what) {
            this.edit = what;
        },
        focusout:function () {
            this.edit = null;
        },
        selectType: function (type) {
            this.type = type;
        },
        focusClean:function (what) {
            what.message='';
            what.state=null;
            this.errorMessage=''
        },
        validUsername:function () {
            if (this.username.val === ''){
                this.username.state =false;
                this.username.message = '请输入用户名';
                return false;
            }

            var reg = /^[\s\S]{6,20}$/;
            var valid = reg.test(this.username.val);

            if (valid){
                var value = this.username.val;
                var param = {
                    url:region+'valid/check-username',
                    type:'GET',
                    dataType:'jsonp',
                    data:{
                        value:value
                    }
                };
                var _this = this;
                $.ajax(param).always(function (data) {
                    if (data.errorCode == '0'){
                        _this.$data.username.state =true;
                        _this.$data.username.message ='';
                    }else{
                        _this.$data.username.state =false;
                        _this.$data.username.message =data.errorMessage;
                    }
                });
            }else{
                this.username.message='请输入6-20位字符';
                this.username.state=false;
            }

        },
        validPwd:function () {
            if (this.password.val ===''){
                this.password.state = false;
                this.password.message = '请输入密码';
                return false;
            }

            var reg = /^[\s\S]{6,20}$/;
            var valid = reg.test(this.password.val);
            if (valid){
                this.password.state = true;
                this.password.message = '';
                if (this.confirmPwd.state !== null){
                    this.validConfirmPwd();
                }
            }else{
                this.password.state = false;
                this.password.message = '请输入6-20位字符';
            }
        },
        validConfirmPwd:function () {
            if (this.confirmPwd.val ===''){
                this.confirmPwd.state = false;
                this.confirmPwd.message = '请输入确认密码';
                return false;
            }

            var confirm = this.confirmPwd.val;
            var reg = /^[\s\S]{6,20}$/;
            var valid = reg.test(confirm);
            if (!valid){
                this.confirmPwd.state=false;
                this.confirmPwd.message='请输入6-20位字符';
                return;
            }
            if (this.confirmPwd.val===this.password.val){
                this.confirmPwd.state=true;
                this.confirmPwd.message='';
            }else{
                this.confirmPwd.state=false;
                this.confirmPwd.message='两次密码输入不一致';
            }
        },
        validMobile:function () {
            if (this.mobile.val ===''){
                this.mobile.state = false;
                this.mobile.message = '请输入手机号';
                return false;
            }

            var mobile = this.mobile.val;
            var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])*\d{8}$/;
            var valid = reg.test(mobile);
            if (!valid){
                this.mobile.state = false;
                this.mobile.message = '手机号格式不正确';
                return;
            }
            var param = {
                url:region+'valid/check-mobile',
                type:'GET',
                dataType:'jsonp',
                data:{
                    value:mobile
                }
            };
            var _this = this;
            $.ajax(param).always(function (data) {
                if (data.errorCode == '0'){
                    _this.$data.mobile.state =true;
                    _this.$data.mobile.message ='';
                }else{
                    _this.$data.mobile.state =false;
                    _this.$data.mobile.message =data.errorMessage;
                }
            });
        },
        maskValid:function (data) {
            this.mask.state = true;
            this.mask.x = data[0].x;
            this.mask.y = data[0].y;
            this.mask.code = data[0].code;
        },
        sendCode:function () {
            var mobile = this.mobile.state;
            var mask = this.mask.state;
            if (!mobile){
                this.validMobile();
                return;
            }
            if (!mask){
                this.mask.state = false;
                return;
            }
            var isClick = this.mobileCode.isClick;
            if (isClick){
                return;
            }
            var param = {
                url:region+"v4/sms-register",
                type:"POST",
                data:{
                    mobile:this.mobile.val,
                    code:this.mask.code,
                    x:this.mask.x,
                    y:this.mask.y
                }
            };
            this.mobileCode.isClick = true;
            this.mobileCode.button = '发送中';
            var _this = this;
            $.ajax(param).always(function (response) {
                if (response.errorCode == '0'){
                    _this.mobileCode.message = '';
                    _this.mobileCode.state = true;
                    _this.mobileCode.isClick = true;
                    var count = 90;
                    var timer = setInterval(function () {
                        if (count <= 0){
                            _this.mobileCode.isClick = false;
                            _this.mobileCode.button = '重新发送';
                            clearTimeout(timer);
                        }else{
                            _this.mobileCode.button = '重新发送('+count+')';
                            count --;
                        }

                    },1000);
                }else{
                    _this.mobileCode.message = response.errorMessage;
                    _this.mobileCode.state = false;
                    _this.mobileCode.button = '发送验证码';
                    _this.mobileCode.isClick = false;
                }

            })
        },
        validMobileCode:function () {
            if (this.mobileCode.val ===''){
                this.mobileCode.state = false;
                this.mobileCode.message = '请输入验证码';
                return false;
            }
            var reg = /^[\s\S]{6}$/;
            var valid = reg.test(this.mobileCode.val);
            if (valid){
                var param = {
                    url:region+'valid/check-register-mobile-and-code',
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
            }else{
                this.mobileCode.state = false;
                this.mobileCode.message = '输入正确的手机验证码';
            }
        },
        isAgree:function () {
            this.agree.state = !this.agree.state;
        },
        register:function () {
            if (!this.username.state){
                this.validUsername();
            }
            if (!this.password.state){
                this.validPwd();
            }
            if (!this.confirmPwd.state){
                this.validConfirmPwd();
            }
            if (!this.mobile.state){
                this.validMobile();
            }
            if (!this.mobileCode.state){
                this.validMobileCode();
            }
            if (this.passed){
                var param = {
                    url:region+'v4/register',
                    type:'POST',
                    data:{
                        username:this.username.val,
                        password:this.password.val,
                        mobile:this.mobile.val,
                        code:this.mobileCode.val,
                        userType:this.type
                    }
                };
                var _this = this;
                $.ajax(param).always(function (data) {
                    if (data.errorCode == '0'){
                        _this.$data.registerState = 2;
                    }else{
                        _this.$data.errorMessage = data.errorMessage;
                    }
                });
            }

        },
        login:function () {
            var param = {
                type:'POST',
                url:region+'v4/login',
                data:{
                    username:this.username.val,
                    password:this.password.val
                }
            };
            function success(response) {
                var script = $(response.result);
                window.topRef = '//console.sightp.com';
                response.result.forEach(function (item) {
                    var script = $('<script>').attr('src',item);
                    $('body').append(script);
                });
                setTimeout(function () {
                    window.location.href='//console.sightp.com';
                },1000);
            }
            function failed() {
                window.location.href='//console.sightp.com';
            }
            $.ajax(param).always(function (data) {
                if (data.errorCode == '0'){
                    success(data);
                }else {
                    failed(data);
                }
            })
        }
    }
});

window.onload = function () {
    var register = new Vue({
        el: '#register',

    });
};
