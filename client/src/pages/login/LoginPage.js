//LoginPage.js 登陆页

import '../../static/css/layout.less';
import './login.less';
import React, { Component } from 'react';
import { render } from 'react-dom';
import HeaderNav from '../../components/headerNav/HeaderNav';
import AlertDialog from '../../components/alertDialog/AlertDialog';
import {wrapperClick} from '../../utils/tap';
var HomeStore = require('../../components/HomeStore');

//localStorage.clear();

export default class LoginPage extends React.Component {
    
	constructor(props) {
	    super(props);
	    this.state = {
	        userInfo: {},
            validInfo: '',
            loginInfo: {},
            showDialog: false,
            dialogMsg: ''
	    };
	    HomeStore.dispose();
	    HomeStore.listen(['userInfo', 'doLogin'], this);
	}

	componentDidMount() {
	    const me = this;
	    //获取用户信息
	    HomeStore.getUserInfoData();
        //获取用户登录信息
        me.getLoginInfo();
	}

	afterGetUserInfo = (data) => {
	    const me = this;
	    console.log('UserData=======',data);
	    if(!data) {
	        return;
	    }
	    me.setState({
	        userInfo: data,
	    });
	}

    afterGetDoLogin = (data) => {
        const me = this;
        let loginInfo = {};
        let validInfo = '';
        if(!data) {
            return;
        }
        if (data.error_code == 2 && data.result) {
            if (window.localStorage) {
                let storage = window.localStorage;
                loginInfo = JSON.stringify(data.result);
                storage.setItem('login',loginInfo);
            }
            this.setState({
                showDialog: true,
                dialogMsg: data.error_msg
            });
        } else {
            this.setState({
                validInfo: data.error_msg,
            });
        }
    }

    //获取用户登录信息
    getLoginInfo = () => {
        let storage = window.localStorage;
        if (storage && storage.login) {
            let loginData = JSON.parse(storage.login);
            console.log('=====LoginPage LoginInfo', loginData );
            this.setState({
                loginInfo: loginData
            });
        }
    }

    loginHandler = () => {
        let userName = this.refs.userName;
        let password = this.refs.password;
        let params = {};

        //输入有效性验证
        if (userName.length > 8) {
            this.setState({
                validInfo: '用户名不能超过8位'
            });
            return;
        }
        if (userName.value == '') {
            this.setState({
                validInfo: '用户名不能为空'
            });
            return;
        }
        if (password.length > 10) {
            this.setState({
                validInfo: '用户密码不能超过10位'
            });
            return;
        }
        if (password.value == '') {
            this.setState({
                validInfo: '用户密码不能为空'
            });
            return;
        }

        params = {
            user_name: userName.value || '',
            password: password.value || ''
        }
        HomeStore.doLogin(params);
    }

    closeDialog = (type) => {
        this.setState({
            showDialog: false,
        }, () => {
            if (type == 'loginSccess') {
                location.href = location.href.replace(location.hash, '') + '#' + '/index';
            }
        });
    } 

    jumpToRegister = () => {
        let link = '/register';
        location.href = location.href.replace(location.hash, '') + '#' + link;
    }

    render() {
    	const me = this;
    	let userData = me.state.userInfo || {};
        let validInfo = me.state.validInfo;

        return (
            <div className="wrapper">
                <HeaderNav data={userData}></HeaderNav>
                <div className="container">
                <AlertDialog dialogShow={me.state.showDialog} content={me.state.dialogMsg}  close={this.closeDialog.bind(this,'loginSccess')}></AlertDialog>
                    <div className="main">  
                    	<div className="login-wrapper">
                    		<div className="input-wrapper">
                    			<label>账号：</label><input ref="userName" type="text" placeholder="请输入账号"/><br/>
                    			<label>密码：</label><input ref="password" type="password" placeholder="请输入密码"/>
                    			<h3 className="error-info" ref="validInfo">{validInfo}</h3>
                    			<div className="login-conform" onClick={me.loginHandler}>登录</div>
                    		</div>
                    		<div className="else-login">
                                <p onClick={this.jumpToRegister}>新用户注册</p>
                    		</div>
                    	</div>                
                    </div>
                </div>
            </div>
        )
    }
}
