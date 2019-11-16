// FRONT END JS FILE
'use strict'

const modal = document.getElementById('report-modal')
const modalTrigger = document.getElementById('add-report')
const modalDestroyer = document.querySelector('.close')

const openModal = () => {
	modal.classList.add('show')
}

const closeModal = () => {
	modal.classList.remove('show')
}

const outsideClick = (e) => {
	if (e.target === modal) {
		closeModal()
	}
}

modalTrigger.addEventListener('click', openModal)
modalDestroyer.addEventListener('click', closeModal)
window.addEventListener('click', outsideClick)
