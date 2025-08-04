import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <img className="img" src="./img/previous_core.jpeg" alt="Team Members" />
        <div className="textBox">
          <h2 className="title">Team Members</h2>
          <ul className="memberList">
            <li>1. G Sri Sai Meghana – Chair</li>
            <li>2. Srujana A Rao – Vice Chair</li>
            <li>3. Harshavardhan S – Secretary</li>
            <li>4. Bhuvan Kumar SG – Treasurer</li>
            <li>5. Manvendra Singh – Membership Chair</li>
            <li>6. Sudeep S – Web Master</li>
          </ul>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    width: 90vw;
    max-width: 750px;
    aspect-ratio: 4 / 3;
    background: #313131;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    color: white;
    transition: transform 0.2s ease-in-out;
    min-height: 320px;
  }

  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    z-index: 1;
    transition: 0.3s ease-in-out;
  }

  .textBox {
    position: absolute;
    z-index: 2;
    opacity: 0;
    padding: 2rem 1.5rem;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 20px;
    text-align: center;
    width: 95%;
    height: 85%;
    transition: 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.8;
    will-change: opacity;
  }

  .title {
    font-size: 2rem;
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 8px;
    text-decoration-color: #38bdf8;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
  }

  .memberList {
    list-style: none;
    padding: 0;
    margin: 0;
    font-weight: bold;
    font-size: clamp(1rem, 2vw, 1.15rem);
    color: white;
    line-height: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .card:hover > .textBox {
    opacity: 1;
  }
  .card:hover > .img {
    filter: blur(6px);
    animation: anim 3s infinite;
  }
  @keyframes anim {
    0% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0); }
  }
  .card:hover {
    transform: scale(1.03);
  }

  /* Responsive Queries */
  @media (max-width: 600px) {
  .card {
    aspect-ratio: 1 / 1;        /* Force square shape */
    min-height: 0;              /* Remove old min */
    max-width: 98vw;            /* Keep card within screen */
    width: 98vw;                /* Make width fill viewport */
    height: 98vw;               /* Set height equal to width for square */
  }
  .textBox {
    padding: 1rem 0.5rem;
    width: 98%;
    height: 94%;
  }
  .title {
    font-size: 1.25rem;
    margin-bottom: 0.7rem;
  }
  .memberList {
    font-size: 0.98rem;
    gap: 0.4rem;
  }


  }
`;

export default Card;
