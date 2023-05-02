import { storage } from './initFirebase';

// import { encryptText, decryptText } from '../utils';

import {
	getFirestore,
	collection,
	onSnapshot,
	getDocs,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
	query,
	serverTimestamp,
	orderBy,
} from 'firebase/firestore';

import { ref, uploadBytesResumable, deleteObject, getDownloadURL } from 'firebase/storage';

const database = getFirestore();
// collection ref
const colRef = collection(database, 'CS-Courses');

// const userId = JSON.parse(localStorage.getItem('user_details'))?.userId || '';

function getUserAllNoteData(setAllCourses, setIsGetLoading, handleMsgShown) {
	const getDataQuery = query(colRef, orderBy('updatedOn', 'desc')); // orderBy('name', 'desc || ase')
	setIsGetLoading(true);
	onSnapshot(
		colRef,
		async (realSnapshot) => {
			await getDocs(getDataQuery)
				.then((snapshot) => {
					let allCourses = [];
					snapshot.docs.forEach((doc) => {
						allCourses.push({
							courseId: doc.id,
							courseThumbnail: doc.data()?.courseThumbnail,
							courseName: doc.data()?.courseName,
							aboutCourse: doc.data()?.aboutCourse,
							coursePrice: doc.data()?.coursePrice,
							courseType: doc.data()?.courseType,
							demoVideo: doc.data()?.demoVideo,
							courseLink: doc.data()?.courseLink,
							updatedOn: doc.data()?.updatedOn,
						});
					});
					setIsGetLoading(false);
					setAllCourses(allCourses);
				})
				.catch((err) => {
					setIsGetLoading(false);
					console.log(err.message);
					handleMsgShown(err.code, 'error');
				});
		},
		(err) => {
			setIsGetLoading(false);
			console.log(err);
			handleMsgShown(err.code, 'error');
		}
	);
}

// //Add Notes
function addNewCourse(incomingData, imageFileRef, setIsNotesModalOpen, setIsAddBtnLoading, handleMsgShown) {
	const { courseName, aboutCourse, courseType, coursePrice, demoVideo, courseLink } = incomingData;
	if (!courseName || !aboutCourse || !courseType || !coursePrice || !demoVideo || !courseLink) {
		handleMsgShown('Please Provide all details', 'error');
		console.log('Please Provide all details');
		return;
	}
	setIsAddBtnLoading(true);
	const NewColRef = collection(database, courseType);

	if (imageFileRef) {
		addDoc(NewColRef, { ...incomingData, updatedOn: serverTimestamp(), createdOn: serverTimestamp() })
			.then((e) => {
				const newCourseId = e?.id;
				const imageRef = ref(storage, courseType + '/' + newCourseId + '_' + courseType + '_thumbnail');

				uploadBytesResumable(imageRef, imageFileRef)
					.then((snapshot) => {
						getDownloadURL(snapshot.ref)
							.then((downloadURL) => {
								const docRef = doc(database, courseType, newCourseId);

								updateDoc(docRef, { courseThumbnail: downloadURL })
									.then(() => {
										console.log('Course added Successfully');
										setIsNotesModalOpen(false);
										setIsAddBtnLoading(false);
										handleMsgShown('Course Added Successfully', 'success');
									})
									.catch((err) => {
										handleMsgShown(err.code, 'error');
										setIsAddBtnLoading(false);
										console.log(err.message);
									});
							})
							.catch((err) => {
								setIsAddBtnLoading(false);
								console.log(err.message);
								handleMsgShown(err.code, 'error');
							});
					})
					.catch((err) => {
						setIsAddBtnLoading(false);
						console.log(err.message);
						handleMsgShown(err.code);
					});
			})
			.catch((err) => {
				setIsAddBtnLoading(false);
				handleMsgShown(err.code);
				console.log(err);
			});
	} else {
		addDoc(NewColRef, { ...incomingData, updatedOn: serverTimestamp(), createdOn: serverTimestamp() })
			.then((e) => {
				console.log('Course added Successfully');
				setIsNotesModalOpen(false);
				setIsAddBtnLoading(false);
				handleMsgShown('Course Added Successfully', 'success');
			})
			.catch((err) => {
				setIsAddBtnLoading(false);
				handleMsgShown(err.code);
				console.log(err);
			});
	}
}

//delete course
function deleteData(CourseId, courseType, setIsNotesModalOpen, setMsg, handleMsgShown) {
	if (!CourseId || !courseType) {
		handleMsgShown('Please Provide all details', 'error');
		console.log('Please Provide all details');
		return;
	}
	const docRef = doc(database, courseType, CourseId);

	deleteDoc(docRef)
		.then((e) => {
			const desertRef = ref(storage, courseType + '/' + CourseId + '_' + courseType + '_thumbnail');
			setIsNotesModalOpen(false);
			deleteObject(desertRef).then(() => {
				console.log('File deleted successfully');
			}).catch((err) => {
				console.log(err.message);
				setMsg(err.code);
			});
		})
		.catch((err) => {
			console.log(err.message);
			setMsg(err.code);
		});
}

//update course
function updateCourseDetails(incomingData, imageFileRef, setIsSaveLoading, handleMsgShown) {
	const { courseId, courseName, courseType, aboutCourse, coursePrice, demoVideo, courseLink } = incomingData;
	if (
		!courseId ||
		!courseName ||
		!courseType ||
		!aboutCourse ||
		!coursePrice ||
		!demoVideo ||
		!courseLink
	) {
		handleMsgShown('Please Provide all details', 'error');
		console.log('Please Provide all details');
		return;
	}
	setIsSaveLoading(true);
	const docRef = doc(database, 'CS-Courses', courseId);

	if (imageFileRef) {
		const imageRef = ref(storage, 'CS-Courses/' + courseId + '_' + courseType + '_thumbnail');

		uploadBytesResumable(imageRef, imageFileRef)
			.then((snapshot) => {
				console.log('Uploaded successfully a blob or file!');

				getDownloadURL(snapshot.ref)
					.then((downloadURL) => {
						updateDoc(docRef, {
							...incomingData,
							courseThumbnail: downloadURL,
							updatedOn: serverTimestamp(),
						})
							.then(() => {
								setIsSaveLoading(false);
								handleMsgShown('Course Updated Successfully', 'success');
							})
							.catch((err) => {
								setIsSaveLoading(false);
								console.log(err.message);
								handleMsgShown(err.code, 'error');
							});
					})
					.catch((err) => {
						setIsSaveLoading(false);
						console.log(err.message);
						handleMsgShown(err.code, 'error');
					});
			})
			.catch((err) => {
				setIsSaveLoading(false);
				console.log(err.message);
				handleMsgShown(err.code);
			});
	} else {
		let courseThumbnail = incomingData?.courseThumbnail ? incomingData?.courseThumbnail : 'https://firebasestorage.googleapis.com/v0/b/sharplearn-2fe87.appspot.com/o/photoNotAvailable.jpeg?alt=media&token=18505eb6-80ee-4e9a-b81b-8a1a84c6e23d';
		updateDoc(docRef, { ...incomingData, courseThumbnail, updatedOn: serverTimestamp() })
			.then(() => {
				setIsSaveLoading(false);
				handleMsgShown('Course Updated Successfully', 'success');
			})
			.catch((err) => {
				handleMsgShown(err.code, 'error');
				setIsSaveLoading(false);
				console.log(err.message);
			});
	}
}

export { getUserAllNoteData, addNewCourse, updateCourseDetails, deleteData };
