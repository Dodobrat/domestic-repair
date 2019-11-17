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

if(document.body.contains(modalTrigger)) {
	modalTrigger.addEventListener('click', openModal)
	modalDestroyer.addEventListener('click', closeModal)
}
window.addEventListener('click', outsideClick)

const manModal = document.getElementById('manufacturer-modal')
const manModalTrigger = document.getElementById('add-manufacturer')
const manModalDestroyer = document.querySelector('.close.man')
const appModal = document.getElementById('appliance-modal')
const appModalTrigger = document.getElementById('add-appliance')
const appModalDestroyer = document.querySelector('.close.app')

const manOpenModal = () => {
	manModal.classList.add('show')
}

const manCloseModal = () => {
	manModal.classList.remove('show')
}

const manOutsideClick = (e) => {
	if (e.target === manModal) {
		manCloseModal()
	}
}

const appOpenModal = () => {
	appModal.classList.add('show')
}

const appCloseModal = () => {
	appModal.classList.remove('show')
}

const appOutsideClick = (e) => {
	if (e.target === appModal) {
		appCloseModal()
	}
}

if(document.body.contains(manModalTrigger)) {
	manModalTrigger.addEventListener('click', manOpenModal)
	manModalDestroyer.addEventListener('click', manCloseModal)
	appModalTrigger.addEventListener('click', appOpenModal)
	appModalDestroyer.addEventListener('click', appCloseModal)
}
window.addEventListener('click', manOutsideClick)
window.addEventListener('click', appOutsideClick)


