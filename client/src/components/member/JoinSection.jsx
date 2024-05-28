import React from 'react';
import styled from 'styled-components';
import logo from "../../assets/images/PicShare.png";
import {Link} from "react-router-dom";

const JoinSectionBlock = styled.div`
    max-width:345px;
    margin:50px auto;
    text-align:center;
    color:gray;
    .top {
        margin:20px 0; 
        p {
            margin:20px 0;
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
        margin:20px 0;
        button {
            margin-bottom:50px;
            width:95%;
            height:40px;
            background:#ccc;
            color:#fff;
            border-radius:10px;
            &:hover{background:gray;}
        }
        .textColor {color:#09fc52;}
    }
`;

const JoinSection = () => {
    return (
        <JoinSectionBlock>
            <form> 
                <div className='top'>
                    <img src={logo} alt="" className='logo'/>
                    <p>친구들의 사진과 동영상을 보려면 가입하세요.</p>
                    <button>Facebook으로 로그인</button>
                    <p style={{ color:'gray'}}>­―――――――――&nbsp;&nbsp;또는&nbsp;&nbsp;―――――――――</p>
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
                                <input type="text" name="userIrum" id="userIrum" placeholder="성명" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="text" name="nickname" id="nickname" placeholder="닉네임" />
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
                    <button type="submit">가입</button>
                    <p>이미 계정이 있으신가요?&nbsp;&nbsp;<Link to="/login" className='textColor'>로그인</Link></p>
                </div>
            </form>
        </JoinSectionBlock>
    );
};

export default JoinSection;