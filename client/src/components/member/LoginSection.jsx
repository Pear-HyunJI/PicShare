import React from 'react';
import styled from 'styled-components';
import logo from "../../assets/images/PicShare.png";
import {Link} from "react-router-dom";

const LoginSectionBlock = styled.div`
max-width:345px;
margin:50px auto;
text-align:center;
color:gray;
.top {
    margin:20px 0; 
    p {
        margin:20px 0;
        white-space: nowrap;
    }
    button {
        width:95%;
        height:40px;
        background:#ccc;
        color:#fff;
        border-radius:10px;
        &:hover{background:gray;}
    }
}
table {
    width: 100%;
    td {
        padding: 10px;
        text-align: left;

    }
    input {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
}
.btn {
    button {
        margin:20px 0;
        width:95%;
        height:40px;
        background:#ccc;
        color:#fff;
        border-radius:10px;
        &:hover{background:gray;}
    }
    .textColor {color:#09fc52;}
}
`

const LoginSection = () => {
    return (
        <LoginSectionBlock>
            <form> 
                <div className='top'>
                    <img src={logo} alt="" className='logo'/>
                    <p>친구들의 사진과 동영상을 보려면 로그인 하세요.</p>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <input type="text" name="userId" id="userId" placeholder="이메일 주소" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="password" name="userPw" id="userPw" placeholder="비밀번호" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="btn">
                    <button type="submit">로그인</button>
                    <p style={{ color:'gray'}}>­―――――――――&nbsp;&nbsp;또는&nbsp;&nbsp;―――――――――</p>
                    <button>Facebook으로 로그인</button>
                    <p>계정이 없으신가요?&nbsp;&nbsp;<Link to="/join" className='textColor'>가입하기</Link></p>
                </div>
            </form>
        </LoginSectionBlock>
    );
};

export default LoginSection;