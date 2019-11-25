// FRONT END JS FILE
'use strict'

const modal = document.getElementById('report-modal')
const modalTrigger = document.getElementById('add-report')
const modalDestroyer = document.querySelector('.close')
const quoteModal = document.getElementById('quote-modal')
const quoteModalTrigger = document.getElementById('quote')
const quoteModalDestroyer = document.querySelector('.close.quote')

const openModal = () => {
	modal.classList.add('show')
}

const quoteOpenModal = () => {
	quoteModal.classList.add('show')
}

const closeModal = () => {
	modal.classList.remove('show')
}

const quoteCloseModal = () => {
	quoteModal.classList.remove('show')
}

const outsideClick = (e) => {
	if (e.target === modal) {
		closeModal()
	}
}
const quoteOutsideClick = (e) => {
	if (e.target === quoteModal) {
		quoteCloseModal()
	}
}

if(document.body.contains(modalTrigger)) {
	modalTrigger.addEventListener('click', openModal)
	modalDestroyer.addEventListener('click', closeModal)
}
if(document.body.contains(quoteModalTrigger)) {
	quoteModalTrigger.addEventListener('click', quoteOpenModal)
	quoteModalDestroyer.addEventListener('click', quoteCloseModal)
}
window.addEventListener('click', outsideClick)
window.addEventListener('click', quoteOutsideClick)

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

const toast = document.querySelector('.toast')
const removeAfter = 3000
if (document.body.contains(toast)) {
	window.onload = () => {
		setTimeout(() => {
			toast.classList.add('hide')
		},removeAfter)
	}
}


