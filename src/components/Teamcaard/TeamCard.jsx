import React from 'react';
import styled from 'styled-components';

const Card = (props) => {
  return (
    <StyledWrapper>
      <div className="card">
        <button className="mail">
          <a href={`mailto:${props.email}`} target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width={20} height={16} x={2} y={4} rx={2} /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
          </a>
        </button>
        <div className="profile-pic">
          <img src={props.pic} alt="" width="666.66669" height="666.66669" viewBox="0 0 666.66669 666.66669" />
          
        </div>
        <div className="bottom">
          <div className="default-content">
            <span className="name">{props.role1}</span> {/* Show only name initially */}
          </div>

          <div className="hover-content">
            <div className="hover-text">
              <span className="name">{props.name} <br /></span>
              <span className="about-me">{props.role2}</span>
            </div>
            <div className="social-links-container">

              {/* <a href={props.email} target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" width="20" height="20">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
              </a> */}

              <a href={props.linkedin} target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.7 0 53.5S24.09-1 53.79-1s53.8 24.1 53.8 54.5-24.1 54.6-53.8 54.6zM447.9 448h-92.4V302.4c0-34.7-.7-79.3-48.3-79.3-48.3 0-55.7 37.7-55.7 76.7V448h-92.4V148.9h88.7v40.8h1.3c12.4-23.6 42.5-48.3 87.5-48.3 93.6 0 110.8 61.6 110.8 141.6V448z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper >
  );
}

const StyledWrapper = styled.div`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
  .card {
    width: 300px;
    height: 350px;
    background: white;
    border-radius: 32px;
    padding: 3px;
    position: relative;
    box-shadow: #604b4a30 0px 70px 30px -50px;
    transition: all 0.5s ease-in-out;
    font-family: 'IBM Plex Sans', sans-serif;
  }

  .card .mail {
    position: absolute;
    right: 2rem;
    top: 1.4rem;
    background: transparent;
    border: none;
  }

  .card .mail svg {
    stroke: #87CEFA;
    stroke-width: 3px;
  }

  .card .mail svg:hover {
    stroke: #f55d56;
  }

  .card .profile-pic {
    position: absolute;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    top: 3px;
    left: 3px;
    border-radius: 29px;
    z-index: 1;
    border: 0px solid #87CEFA;
    overflow: hidden;
    transition: all 0.5s ease-in-out 0.2s, z-index 0.5s ease-in-out 0.2s;
  }

  .card .profile-pic img {
    -o-object-fit: cover;
    object-fit: cover;
    width: 100%;
    height: 100%;
    -o-object-position: 0px 0px;
    object-position: 0px 0px;
    transition: all 0.5s ease-in-out 0s;
  }

  .card .profile-pic svg {
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: 0px 0px;
    object-position: 0px 0px;
    transform-origin: 45% 20%;
    transition: all 0.5s ease-in-out 0s;
  }

  .card .bottom {
    position: absolute;
  bottom: 3px;
  left: 3px;
  right: 3px;
  top: 80%;
  border-radius: 29px;
  background: #87CEFA;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(96, 75, 74, 0.188) 0px 5px 5px 0px inset;
  overflow: hidden;
  padding: 1rem;
  box-sizing: border-box;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
  }


  .card .bottom .default-content {
   width: 100%;
  text-align: center;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card .bottom .hover-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  opacity: 0;
  width: 100%;
  padding: 0 1rem;
  transition: opacity 0.3s ease-in-out;
}

.card:hover .bottom .default-content {
  opacity: 0;
}

.card:hover .bottom .hover-content {
  opacity: 1;
}

.card .bottom .hover-content .social-links-container {
  display: flex;
  justify-content: center;
  flex-wrap : wrap ;
  gap: 1.0rem;
  margin-top: 1rem;
}
  
.card .bottom .hover-content .social-links-container a svg:hover{
fill: #464444ff}

.card .bottom .hover-content .name{
  font-size : 2rem;
  font-weight : bold;
  line-height:0.8;
  color: #2077e8ff;
  

  }

.card .bottom .hover-content .about-me{
  font-size : 1.3rem;
  font-weight : bold;
  line-height:0.8;
  
  

  
  }

.card .bottom .default-content .name {
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  line-height: 1.2;
  padding: 2px;
}

.card .bottom .default-content .about-me {
  font-weight: bold;
  font-size: 1.3rem;
  color: white;
  margin-top: 0.25rem;
  line-height: 1.2;
}


  .card:hover {
    border-top-left-radius: 55px;
  }

  .card:hover .bottom {
    top: 20%;
    border-radius: 80px 29px 29px 29px;
    transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s;
  }

  .card:hover .profile-pic {
    width: 100px;
    height: 100px;
    aspect-ratio: 1;
    top: 10px;
    left: 10px;
    border-radius: 50%;
    z-index: 3;
    border: 7px solid #87CEFA;
    box-shadow: rgba(96, 75, 74, 0.1882352941) 0px 5px 5px 0px;
    transition: all 0.5s ease-in-out, z-index 0.5s ease-in-out 0.1s;
  }

  .card:hover .profile-pic:hover {
    transform: scale(1.3);
    border-radius: 0px;
  }

  .card:hover .profile-pic img {
  object-fit: cover;
  transform: scale(1);
  object-position: center;
  transition: all 0.5s ease-in-out 0.5s;
}

  .card:hover .profile-pic svg {
    transform: scale(2.5);
    transition: all 0.5s ease-in-out 0.5s;

  }`;

export default Card;
