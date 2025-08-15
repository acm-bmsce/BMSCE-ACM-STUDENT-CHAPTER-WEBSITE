import React from 'react';
import styled from 'styled-components';

const Card = (props) => {
  return (
    <StyledWrapper>
      <div className="card">
        <button className="mail">
          <a href={`mailto:${props.email}`} target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect width={20} height={16} x={2} y={4} rx={2} />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </button>
        <div className="profile-pic">
          <img src={props.pic} alt="" />
        </div>
        <div className="bottom">
          <div className="default-content">
            <span className="name">{props.role1}</span>
          </div>
          <div className="hover-content">
            <div className="hover-text">
              <span className="name">{props.name} <br /></span>
              <span className="about-me">
                {props.role2.split(',').map((part, i) => (
                  <React.Fragment key={i}>
                    {part.trim()}
                    {i !== props.role2.split(',').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </div>
            <div className="social-links-container">
              <a href={props.linkedin} target="_blank" rel="noopener noreferrer">
                {/* LinkedIn Mercado Match Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="24"
                  height="24"
                  focusable="false"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
  .card {
    width: 300px;
    height: 350px;
    background: #ffffffff;
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
    stroke: #2077e8ff;
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
fill: #2077e8ff}

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
