import React from 'react';
import Modal from '@mui/material/Modal';

import Button from '@mui/material/Button';
import MuiBtn from '../EnrollBtn/MuiBtn';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import photoNotAvailable from '../../images/photoNotAvailable.jpeg';

import './modalWrapper.css';

function ModalWrapper({
	open,
	modalType,
	handleModalClose,
	isSaveLoading,
	containerClassName,
	OpenCourse,
	handleCourseInputChange,
	handleCourseDetailsUpdate,
	imageFileRef,
	setImageFileRef,
	toggleConfirmationDialogClosing,
	handleAddNewCourseBtnClick,
	isAddBtnLoading,
}) {
	return (
		<Modal open={open} onClose={() => handleModalClose('')}>
			<div className={['modal', containerClassName].join('')}>
				<div className="modalHeader">
					<div>{new Date(OpenCourse?.updatedOn?.seconds * 1000)?.toLocaleString('en-US')}</div>
					<Button id="closeBtn" color="inherit" variant="text" onClick={handleModalClose}>
						Close
					</Button>
				</div>

				<div className="modalCourseBox">
					<div className="courseImgAndName">
						<img
							className="modalCourseImg"
							src={
								imageFileRef
									? URL.createObjectURL(imageFileRef)
									: OpenCourse?.courseThumbnail || photoNotAvailable
							}
							loading="lazy"
							alt=""
						/>

						<div className="courseNameAndPrice">
							{modalType === 'edit' ? (
								<div className="courseType"> {OpenCourse?.courseType || 'N/A'}</div>
							) : (
								<>
									<Select
										label="Course Type"
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										className="courseTypeInput"
										name="courseType"
										value={OpenCourse?.courseType || ''}
										placeholder="Course Type"
										onChange={handleCourseInputChange}
									>
										<MenuItem value="CS-Courses">CS-Courses</MenuItem>
										<MenuItem value="Hacking">Hacking</MenuItem>
										<MenuItem value="Video Editing">Video Editing</MenuItem>
										<MenuItem value="Photo Editing">Photo Editing</MenuItem>
										<MenuItem value="JEE">JEE</MenuItem>
										<MenuItem value="NEET">NEET</MenuItem>
										<MenuItem value="English Courses">English Courses</MenuItem>
									</Select>
									<br />
								</>
							)}
							<TextField
								label="Course Name"
								className="courseTitleInput"
								required
								variant="outlined"
								name="courseName"
								autoComplete="off"
								value={OpenCourse?.courseName || ''}
								onChange={handleCourseInputChange}
							/>{' '}
							<br />
							<TextField
								type="number"
								label="ORG Price"
								name="courseORGPrice"
								className="coursePriceInput"
								required
								variant="outlined"
								autoComplete="off"
								value={OpenCourse?.courseORGPrice || ''}
								onChange={handleCourseInputChange}
							/>
							<br />
							<TextField
								type="number"
								label="Discounted Price"
								name="courseDiscountedPrice"
								className="coursePriceInput"
								required
								variant="outlined"
								autoComplete="off"
								value={OpenCourse?.courseDiscountedPrice || ''}
								onChange={handleCourseInputChange}
							/>
							<br />
							<input
								type="file"
								className="courseThumbnailInput"
								accept="image/png, image/gif, image/jpeg"
								name="courseThumbnail"
								onChange={(e) => {
									setImageFileRef(e?.target?.files?.[0]);
								}}
							/>
						</div>
					</div>
					<div className="courseDetailsInputArea">
						<textarea
							className="aboutCourseInput"
							placeholder="About Course"
							name="aboutCourse"
							required={true}
							value={OpenCourse?.aboutCourse || ''}
							onChange={handleCourseInputChange}
						/>
						<br />
						<TextField
							label="Demo Video Link"
							className="demoVideoLinkInput"
							name="demoVideo"
							required={true}
							autoComplete="off"
							value={OpenCourse?.demoVideo || ''}
							onChange={handleCourseInputChange}
						/>
						<br />
						<TextField
							label="Course Link"
							className="courseLinkInput"
							placeholder="Course Link"
							name="courseLink"
							required
							autoComplete="off"
							value={OpenCourse?.courseLink || ''}
							onChange={handleCourseInputChange}
						/>
						<br />
						{modalType === 'edit' ? (
							<>
								<MuiBtn
									onBtnClick={toggleConfirmationDialogClosing}
									sx={{ marginRight: '10px' }}
									color="error"
									// isBtnLoading={isDeleteLoading}
									BtnText="Delete"
								/>
								<MuiBtn
									onBtnClick={handleCourseDetailsUpdate}
									color="success"
									isBtnLoading={isSaveLoading}
									BtnText="Save"
								/>
							</>
						) : (
							<MuiBtn
								onBtnClick={handleAddNewCourseBtnClick}
								color="success"
								isBtnLoading={isAddBtnLoading}
								BtnText="Add"
							/>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
}

export default ModalWrapper;
