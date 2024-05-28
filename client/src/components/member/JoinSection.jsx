import React from 'react';
import styled from 'styled-components'
import logo from "../../assets/images/PicShare.png";


const JoinSectionBlock = styled.div`
max-width:780px;
margin:50px auto;
// display: flex;
// align-items:center;
// justify-content:center;
text-align:center;
//  .logo {flex:1;}
`

const JoinSection = () => {
    return (
        <JoinSectionBlock>
        <form> 
            <div>
                <img src={logo} alt="" className='logo'/>
                <p>친구들의 사진과 동영상을 보려면 가입하세요.</p>
                <button>Facebook으로 로그인</button>
                <p>­ ―――――― 또는 ―――――― </p>
            </div>
            <table border="1">
                <colgroup>
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <span>이메일 주소</span>
                        <td><input type="text" name="userId" id="userId" /></td>
                    </tr>
                    <tr>
                        <td><label htmlFor="userIrum">성명</label></td>
                        <td><input type="text" name="userId" id="userId" /></td>
                    </tr>
                    <tr>
                        <td><label htmlFor="userIrum">닉네임</label></td>
                        <td><input type="text" name="userId" id="userId" /></td>
                    </tr>
                    <tr>
                        <td><label htmlFor="userPw">비밀번호</label></td>
                        <td><input type="password" name="userPw" id="userPw"  /></td>
                    </tr>
                </tbody>
            </table>
            <div className="btn">
                <button type="submit">가입</button>
            </div>
        </form>
        
    </JoinSectionBlock>
    );
};

export default JoinSection;