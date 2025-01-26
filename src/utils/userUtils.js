function capitalizeFirstLetter(str) {
	if (typeof str !== 'string' || str.length === 0) {
		return '';
	}
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function esSoloNumerico(cadena) {
    // La expresión regular permite un "+" al inicio, seguido solo de dígitos
    const patron = /^\+?[0-9]+$/;
    return patron.test(cadena);
}