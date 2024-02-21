import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { BiPowerOff } from 'react-icons/bi';
import CryingRobot from '../assets/crying_robot.gif'
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setModalIsOpen(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClick}>
                <BiPowerOff/>
            </Button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                style={{
                    content: {
                        width: '350px',
                        height: '270px',
                        margin: 'auto',
                        backgroundColor: '#fff',
                        borderRadius: '20px' 
                    }
                }}
            >
                <ModalContent>
                    <h2>Bạn có muốn thoát không?</h2>
                    <img src={CryingRobot} alt="" />
                    <ButtonWrapper>
                        <CancelButton onClick={handleCloseModal}>Không</CancelButton>
                        <ConfirmButton onClick={handleLogout}>Có</ConfirmButton>
                    </ButtonWrapper>
                </ModalContent>
            </Modal>
        </div>
    )
}

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #9a86f3;
    border: none;
    cursor: pointer;
    svg {
        font-size: 1.3rem;
        color: #ebe7ff;
    }
`;

const ModalContent = styled.div`
    text-align: center;
    img {
        height: 150px;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
`;

const CancelButton = styled.button`
    flex: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #ccc;
    cursor: pointer;
`;

const ConfirmButton = styled.button`
    flex: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #9a86f3;
    cursor: pointer;
    color: #fff;
`;
