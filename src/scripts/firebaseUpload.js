import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// Configuración de Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyC46Bfdol9UpXiN5Brd4PGrpqiBfZscPJ8',
	authDomain: 'stellar-fx-444302-f2.firebaseapp.com',
	projectId: 'stellar-fx-444302-f2',
	storageBucket: 'stellar-fx-444302-f2.firebasestorage.app',
	messagingSenderId: '923697762592',
	appId: '1:923697762592:web:158ab092f0b139fdd6c745',
	measurementId: 'G-RGN2KQ32KL',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const subirImagenAFirebase = async (file) => {
	const storageRef = ref(storage, `productos/${file.name}`);
	await uploadBytes(storageRef, file);
	return await getDownloadURL(storageRef);
};
