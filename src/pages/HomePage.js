import React, { useState, useEffect, useCallback } from 'react';
import { handleUserState } from '../firebase/auth';
import { getUserAllNoteData, addNewCourse, updateCourseDetails, deleteData } from '../firebase//home.js';

import NavBar from '../components/Bar/NavBar/NavBar';
import FootBar from '../components/Bar/Footer/Footer';
import MuiBtn from '../components/EnrollBtn/MuiBtn.js';
import ModalWrapper from '../components/Modal/ModalWrapper.js';
import Loader from '../components/Loader/Loader';
import ShowMsg from '../components/ShowMsg/ShowMsg.js';
import ConfirmationDialog from '../components/ConfirmationDialog/ConfirmationDialog.js';

import '../styles/homePage.css';

import photoNotAvailable from '../images/photoNotAvailable.jpeg';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

function HomePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [isGetLoading, setIsGetLoading] = useState(true);
	const [isSaveLoading, setIsSaveLoading] = useState(false);
	const [isAddBtnLoading, setIsAddBtnLoading] = useState(false);
	const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
	const [allCourses, setAllCourses] = useState([]);
	const [OpenCourse, setOpenCourse] = useState({});
	const [isNotesModalOpen, setIsNotesModalOpen] = useState({ state: false, type: '' });
	const [imageFileRef, setImageFileRef] = useState(null);

	const handleMsgShown = useCallback((msgText, type) => {
		if (msgText) {
			setMsg({ text: msgText, type: type });
			setTimeout(() => {
				setMsg({ text: '', type: '' });
			}, 2500);
		} else {
			console.log('Please Provide Text Msg');
		}
	}, []);

	useEffect(() => {
		handleUserState('homePage');
		getUserAllNoteData(setAllCourses, setIsGetLoading, handleMsgShown);
	}, [handleMsgShown]);

	const handleModalToggle = useCallback(
		(modalType) => {
			setOpenCourse({});
			setImageFileRef(null);
			setIsNotesModalOpen({ state: !isNotesModalOpen.state, type: modalType });
		},
		[isNotesModalOpen]
	);

	const handleAddNewCourseBtnClick = useCallback(() => {
		addNewCourse(OpenCourse, imageFileRef, setIsNotesModalOpen, setIsAddBtnLoading, handleMsgShown);
	}, [OpenCourse, handleMsgShown, imageFileRef]);

	const handleEditBtn = useCallback(
		(index) => {
			handleModalToggle('edit');
			setOpenCourse(allCourses[index]);
		},
		[allCourses, handleModalToggle]
	);

	const handleDeleteBtnClick = useCallback(
		(id) => {
			if (OpenCourse?.courseId) {
				setIsConfirmationDialogOpen(false);
				deleteData(OpenCourse?.courseId, OpenCourse?.courseType, setIsNotesModalOpen, handleMsgShown, handleMsgShown);
			} else {
				handleMsgShown('Something went wrong.', 'error');
			}
		},
		[OpenCourse, handleMsgShown]
	);

	const handleCourseInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setOpenCourse({ ...OpenCourse, [name]: value });
		},
		[OpenCourse]
	);

	const handleCourseDetailsUpdate = useCallback(() => {
		updateCourseDetails(OpenCourse, imageFileRef, setIsSaveLoading, handleMsgShown);
	}, [OpenCourse, handleMsgShown, imageFileRef]);

	return (
		<div>
			<NavBar handleModalToggle={handleModalToggle} />
			<div className='homePageContainer' component="main">
				<Toolbar />
				<Loader isLoading={isGetLoading} />
				{allCourses.map((item, index) => {
					return (
						<div className="courseBox" key={index}>
							<img
								className="courseImg"
								src={item?.courseThumbnail || photoNotAvailable}
								loading="lazy"
								alt=""
							/>
							<div className="courseDetails">
								<div className="title">{item?.courseName}</div>
								<div className="aboutCourse">{item?.aboutCourse}</div>
								<div className="coursePrice">₹{item?.coursePrice}</div>
								<div className="demoVideoLink">{item?.demoVideo}</div>
								<div className="courseLink">{item?.courseLink}</div>
								<MuiBtn
									onBtnClick={(e) => {
										handleEditBtn(index);
									}}
									BtnText="Edit"
								/>
							</div>
						</div>
					);
				})}
			</div>
			<FootBar />

			{isNotesModalOpen.state && (
				<ModalWrapper
					open={isNotesModalOpen.state}
					modalType={isNotesModalOpen?.type}
					handleModalClose={handleModalToggle}
					OpenCourse={OpenCourse}
					handleCourseInputChange={handleCourseInputChange}
					setOpenCourse={setOpenCourse}
					handleCourseDetailsUpdate={handleCourseDetailsUpdate}
					imageFileRef={imageFileRef}
					setImageFileRef={setImageFileRef}
					isSaveLoading={isSaveLoading}
					handleDeleteBtnClick={handleDeleteBtnClick}
					toggleConfirmationDialogClosing={() => setIsConfirmationDialogOpen(!isConfirmationDialogOpen)}
					handleAddNewCourseBtnClick={handleAddNewCourseBtnClick}
					isAddBtnLoading={isAddBtnLoading}
				/>
			)}

			{isConfirmationDialogOpen && (
				<ConfirmationDialog
					title="Are You Sure?"
					message="Do you want to delete this course?"
					isOpen={isConfirmationDialogOpen}
					onCancel={() => setIsConfirmationDialogOpen(false)}
					onYesClick={handleDeleteBtnClick}
				/>
			)}

			{msg && <ShowMsg isError={msg?.text ? true : false} msgText={msg?.text} type={msg?.type} />}
		</div>
	);
}

export default HomePage;
