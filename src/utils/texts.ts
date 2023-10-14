import { createTooltip, destroyTooltip } from 'floating-vue'

export function getGear(gear : string) : string {
	return gear == 'manual' ? 'แมนนวล' : 'ออโต้'
}

export function getFuel(fuel : string) : string {
	switch (fuel) {
		case 'benzin':
		case 'gasoline':
			return 'เบนซิน'
		case 'diesel':
			return 'ดีเซล'
		case 'hybrid':
			return 'ไฮบริด'
		case 'electric':
			return 'ไฟฟ้า'
		default:
			return 'ไม่ระบุ'
	}
}

export function getThaiDate(date : Date) : string {
	const months = [
		'มกราคม', 'กุมภาพันธ์', 'มีนาคม',
		'เมษายน', 'พฤษภาคม', 'มิถุนายน',
		'กรกฎาคม', 'สิงหาคม', 'กันยายน',
		'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
	]

	return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} น.`
}

export function getInsuranceProperty(what : string) : string {
	switch (what) {
		case 'bodily_injury' :
			return 'ภาคบุคคล'
		case 'property_damage' :
			return 'ภาคทรัพย์สิน'
		case 'thief_fire' :
			return 'การโจรกรรม'
		case 'vehicle_damage' :
			return 'ภาครถยนต์'
	}
	return ''
}

export function popup(el : HTMLElement, text : string) {
	const tooltip = createTooltip(el, {
		content: text,
	}, {})
	
	tooltip.show()
	setTimeout(() => {
		tooltip.hide()

		setTimeout(() => {
			destroyTooltip(el)
			}, 500)
	}, 3000)
}