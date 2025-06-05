import {Vec2} from "../utils/math"

export class Player {
	pos: Vec2
	movedir: number
	lookDir: Vec2
	r: number
	v: number
	turnSpeedRad: number

	constructor(x: number, y: number, movedir: number, r: number) {
		this.pos = new Vec2(x, y)
		this.movedir = movedir
		this.lookDir = new Vec2(movedir, 0)
		this.r = r
		this.v = 150
		this.turnSpeedRad = 3.0
	}
} 