function Runner(){
	this.size = V.scale;
	this.x = V.W/2;
	this.y = V.H/2;
	this.invert = false;
	this.prevInvert = false;
	
	this.state('stay');
	this.timer = 0;
	this.jumpTimer = 0;
	this.jump = false;
	this.jumpSpeed = this.size/20;

	this.freqAnim = 1;
	this.boost = 1;
	this.maxAnim = 10/this.boost;

	this.bodies = {
		name:["Feet","Knee","downBody","Hand","Arm","upBody"],
		Feet:0,
		Knee:1,
		downBody:2,
		Hand:3,
		Arm:4,
		upBody:5,
	}

	this.state('stay');
		
}
Runner.prototype.key = function(type){
	//32 SPACE, 38 UP, 40 DOWN
	if(type == 38 && this.jump == false){
		
		this.invert ? 
					this.invert = false
					: 
					this.jump = true,
					this.state('stay')
			
			
	}
	if(type == 40 && this.jump == false){
		
		this.invert ? 
					(this.jump = true,
					this.state('stay') )
					: 
					this.invert = true
	}

}
Runner.prototype.inverting = function(){
	ctx.save();
	ctx.translate(0, V.H);
	ctx.scale(1, -1);
}
Runner.prototype.shift = function(side, prev, sx, sy){
	this[side+prev+["X"]] += sx;
	this[side+prev+["Y"]] += sy;

}
Runner.prototype.rotate = function(side, part, angle){
		if(part == "Body"){

		var tmp = V.rotate( this.midBodyX, this.midBodyY, angle, this.upBodyX, this.upBodyY );
		this.upBodyX = tmp.x;
		this.upBodyY = tmp.y;
	}else{
		var next = this.bodies.name[this.bodies[part]+1];
		var prev = this.bodies.name[this.bodies[part]-1];
		//console.log(prev, side + part, next);

		if(this.bodies[part] == 1 || this.bodies[part] == 4)
			var tmp = V.rotate( this[next+"X"], this[next+"Y"], angle, this[side+part+"X"], this[side+part+"Y"] )
		else
			var tmp = V.rotate( this[side+next+"X"], this[side+next+"Y"], angle, this[side+part+"X"], this[side+part+"Y"] )
		var prevX = tmp.x - this[side+part+["X"]];
		var prevY = tmp.y - this[side+part+["Y"]];
		this[side+part+["X"]] = tmp.x;
		this[side+part+["Y"]] = tmp.y;
		if(prev){
			this.shift(side, prev, prevX, prevY);
		}
	}
}

Runner.prototype.state = function(type){
	switch(type){
		case 'stay':
			this.leftFeetX = this.x;
			this.leftFeetY = this.y;

			this.rightFeetX = this.x;
			this.rightFeetY = this.y;

			this.leftKneeX = this.x;
			this.leftKneeY = this.y-this.size/4;

			this.rightKneeX = this.x;
			this.rightKneeY = this.y-this.size/4;

			this.downBodyX = this.x;
			this.downBodyY = this.y-this.size/1.8;

			this.midBodyX = this.x+this.size/20;
			this.midBodyY = this.y-this.size/1.4;

			this.upBodyX = this.x+this.size/6;
			this.upBodyY = this.y-this.size;

			this.leftArmX = this.x;
			this.leftArmY = this.upBodyY+this.size/3.5;

			this.rightArmX = this.x;
			this.rightArmY = this.upBodyY+this.size/3.5;

			this.leftHandX = this.x;
			this.leftHandY = this.upBodyY+this.size/2.2;

			this.rightHandX = this.x;
			this.rightHandY = this.upBodyY+this.size/2.2;
			break;
	}
}
Runner.prototype.updatePosition = function(x, y){
	this.leftFeetX += x;
	this.leftFeetY += y;

	this.rightFeetX += x;
	this.rightFeetY += y;

	this.leftKneeX += x;
	this.leftKneeY += y;

	this.rightKneeX += x;
	this.rightKneeY += y;

	this.downBodyX += x;
	this.downBodyY += y;

	this.midBodyX += x;
	this.midBodyY += y;

	this.upBodyX += x;
	this.upBodyY += y;

	this.leftArmX += x;
	this.leftArmY += y;

	this.rightArmX += x;
	this.rightArmY += y;

	this.leftHandX += x;
	this.leftHandY += y;

	this.rightHandX += x;
	this.rightHandY += y;

}
Runner.prototype.move = function(type, i){
	switch(type){
		case "run":
			this.rotate("left","Knee",8 * i);
			this.rotate("left","Feet",5 * i);
			this.rotate("right","Knee",-8 * i);
			this.rotate("right","Feet",-12 * i);

			this.rotate("","Body",1.5 * i);
			

			this.rotate("right","Arm",-6 * i);
			this.rotate("right","Hand",-5 * i);
			this.rotate("left","Arm",6 * i);
			this.rotate("left","Hand",12 * i);
			
			break;
		case "run2":
			this.rotate("left","Knee",7.5 * i);
			this.rotate("left","Feet",2.5 * i);
			this.rotate("right","Knee",-4 * i);
			this.rotate("right","Feet",-7.5 * i);

			this.rotate("","Body",1 * i);
			

			this.rotate("right","Arm",-3.5 * i);
			this.rotate("right","Hand",-1 * i);
			this.rotate("left","Arm",5 * i);
			this.rotate("left","Hand",10 * i);
			break;
		case "jump":
			this.rotate("left","Knee",-8 * i);
			this.rotate("left","Feet",-10 * i);
			this.rotate("right","Knee",-5 * i);
			this.rotate("right","Feet",-8 * i);

			//this.rotate("","Body",-1);

			this.rotate("right","Arm",5 * i);
			this.rotate("right","Hand",10 * i);
			this.rotate("left","Arm",-5 * i);
			this.rotate("left","Hand",-10 * i);
			break;
	}
}
Runner.prototype.draw = function(){
	if(this.jump){
		if(this.jumpTimer < this.maxAnim*2){
			this.updatePosition(0,-this.jumpSpeed*this.boost);
			this.move("jump" , 1 * this.boost);
		}else if(this.jumpTimer < this.maxAnim*3){
			
		}else if(this.jumpTimer < this.maxAnim*5){
			this.updatePosition(0,this.jumpSpeed*this.boost);
			this.move("jump" , -1 * this.boost);
		}else{
			this.jump = false;
			this.jumpTimer = -1;
		}
		this.jumpTimer+=1;
	}
	else if(this.timer<this.maxAnim)
		this.move("run" , 1 * this.boost);
	else if(this.timer<this.maxAnim*2)
		this.move("run", -1 * this.boost);
	else{
		this.state('stay');
		this.timer = -1;
	}

	this.timer+=this.freqAnim;

	if(this.invert){
		this.inverting();
		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";
		
	}


	ctx.lineWidth = this.size/10;
	
	ctx.beginPath();
	//Left leg
	ctx.moveTo(this.leftFeetX, this.leftFeetY);
	ctx.lineTo(this.leftKneeX, this.leftKneeY);
	ctx.lineTo(this.downBodyX, this.downBodyY);
	//Right leg
	ctx.moveTo(this.rightFeetX, this.rightFeetY);
	ctx.lineTo(this.rightKneeX, this.rightKneeY);
	ctx.lineTo(this.downBodyX,this.downBodyY);
	//Body
	ctx.lineTo(this.midBodyX,this.midBodyY);
	ctx.lineTo(this.upBodyX,this.upBodyY);

	//Left arm
	ctx.moveTo(this.upBodyX,this.upBodyY);
	ctx.lineTo(this.leftArmX, this.leftArmY);
	//Left hand
	//ctx.moveTo(this.upBodyX,this.upBodyY+this.size/4);
	ctx.lineTo(this.leftHandX, this.leftHandY);
	//Right arm
	ctx.moveTo(this.upBodyX,this.upBodyY);
	ctx.lineTo(this.rightArmX, this.rightArmY);
	//Right hand
	ctx.lineTo(this.rightHandX, this.rightHandY);

	ctx.stroke();

	//Head
	ctx.beginPath();
	ctx.arc(this.upBodyX+this.size/16,this.upBodyY-this.size/8,this.size/8,0,2*Math.PI);

	ctx.fill();
	ctx.restore();
}

