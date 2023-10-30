import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // 추가
import './styles/cal.css';

const Cal = () => {
  
  let post = '새로운 클럽입니다';
  //let [변수, 변수바꾸기] = useState('New Club');
  let [클럽명, 클럽명바꾸기] = useState(['fencing', 'polo','tango']);
  let [Like, likecount] = useState(0);




  return (
    <div className="container-home">
        <div className="header_test text-center">
      <h4> state 배우는 날</h4>
      </div>
      <div className='clublists'>
        <h3>{ 클럽명[0] }  <span onClick = {() => {likecount(Like + 1)}} > like</span>  {Like}  </h3> 
        <p> 이 클럽은 펜싱 클럽입니다.</p>
        <hr />
      </div>
      <div className='clublists'>
        <h3>{ 클럽명[1] } </h3>
        <p> 이 클럽은 펜싱 클럽입니다.</p>
        
        <hr />
      </div>
      <div className='clublists'>
        <h3>{ 클럽명[2] } </h3>
        <p> 이 클럽은 펜싱 클럽입니다.</p>
        <hr />
      </div>
      


     <button>select date</button>
      
    </div>
  );
};

export default Cal;
