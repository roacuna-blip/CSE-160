class Camera {
    constructor() {
        this.fov = 60;
        this.eye = new Vector3([0, 0, 3]);    
        this.at  = new Vector3([0, 0, -100]); 
        this.up  = new Vector3([0, 1, 0]);    
    }

    forward() {
        let speed = 0.4;

        let f_x = this.at.elements[0] - this.eye.elements[0];
        let f_y = this.at.elements[1] - this.eye.elements[1];
        let f_z = this.at.elements[2] - this.eye.elements[2];
        
        let len = Math.sqrt(f_x*f_x + f_y*f_y + f_z*f_z);
        if (len === 0) return;
        f_x /= len; f_y /= len; f_z /= len;
        
        this.eye.elements[0] += f_x * speed;
        this.eye.elements[1] += f_y * speed;
        this.eye.elements[2] += f_z * speed;
        
        this.at.elements[0] += f_x * speed;
        this.at.elements[1] += f_y * speed;
        this.at.elements[2] += f_z * speed;
    }

    back() {
        let speed = 0.4;
        
        let f_x = this.at.elements[0] - this.eye.elements[0];
        let f_y = this.at.elements[1] - this.eye.elements[1];
        let f_z = this.at.elements[2] - this.eye.elements[2];
        
        let len = Math.sqrt(f_x*f_x + f_y*f_y + f_z*f_z);
        if (len === 0) return;
        f_x /= len; f_y /= len; f_z /= len;
        
        this.eye.elements[0] -= f_x * speed;
        this.eye.elements[1] -= f_y * speed;
        this.eye.elements[2] -= f_z * speed;
        
        this.at.elements[0] -= f_x * speed;
        this.at.elements[1] -= f_y * speed;
        this.at.elements[2] -= f_z * speed;
    }

    left() {
        let speed = 0.4;
        
        let f_x = this.at.elements[0] - this.eye.elements[0];
        let f_y = this.at.elements[1] - this.eye.elements[1];
        let f_z = this.at.elements[2] - this.eye.elements[2];
        
        let s_x = this.up.elements[1] * f_z - this.up.elements[2] * f_y;
        let s_y = this.up.elements[2] * f_x - this.up.elements[0] * f_z;
        let s_z = this.up.elements[0] * f_y - this.up.elements[1] * f_x;
        
        let len = Math.sqrt(s_x*s_x + s_y*s_y + s_z*s_z);
        if (len === 0) return;
        s_x /= len; s_y /= len; s_z /= len;
        
        this.eye.elements[0] += s_x * speed;
        this.eye.elements[1] += s_y * speed;
        this.eye.elements[2] += s_z * speed;
        
        this.at.elements[0] += s_x * speed;
        this.at.elements[1] += s_y * speed;
        this.at.elements[2] += s_z * speed;
    }

    right() {
        let speed = 0.4;
        
        let f_x = this.at.elements[0] - this.eye.elements[0];
        let f_y = this.at.elements[1] - this.eye.elements[1];
        let f_z = this.at.elements[2] - this.eye.elements[2];
        
        let s_x = f_y * this.up.elements[2] - f_z * this.up.elements[1];
        let s_y = f_z * this.up.elements[0] - f_x * this.up.elements[2];
        let s_z = f_x * this.up.elements[1] - f_y * this.up.elements[0];
        
        let len = Math.sqrt(s_x*s_x + s_y*s_y + s_z*s_z);
        if (len === 0) return;
        s_x /= len; s_y /= len; s_z /= len;
        
        this.eye.elements[0] += s_x * speed;
        this.eye.elements[1] += s_y * speed;
        this.eye.elements[2] += s_z * speed;
        
        this.at.elements[0] += s_x * speed;
        this.at.elements[1] += s_y * speed;
        this.at.elements[2] += s_z * speed;
    }

    panLeft() {
        let alpha = 5;
        
        let f_x = this.at.elements[0] - this.eye.elements[0];
        let f_y = this.at.elements[1] - this.eye.elements[1];
        let f_z = this.at.elements[2] - this.eye.elements[2];
        
        let rotMatrix = new Matrix4();
        rotMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        
        let f = new Vector3([f_x, f_y, f_z]);
        let f_prime = rotMatrix.multiplyVector3(f);
        
        this.at.elements[0] = this.eye.elements[0] + f_prime.elements[0];
        this.at.elements[1] = this.eye.elements[1] + f_prime.elements[1];
        this.at.elements[2] = this.eye.elements[2] + f_prime.elements[2];
    }

    panRight() {
        let alpha = -5;
        
        let f_x = this.at.elements[0] - this.eye.elements[0];
        let f_y = this.at.elements[1] - this.eye.elements[1];
        let f_z = this.at.elements[2] - this.eye.elements[2];
        
        let rotMatrix = new Matrix4();
        rotMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        
        let f = new Vector3([f_x, f_y, f_z]);
        let f_prime = rotMatrix.multiplyVector3(f);
        
        this.at.elements[0] = this.eye.elements[0] + f_prime.elements[0];
        this.at.elements[1] = this.eye.elements[1] + f_prime.elements[1];
        this.at.elements[2] = this.eye.elements[2] + f_prime.elements[2];
    }

    panDegrees(degrees) {
    let rotMatrix = new Matrix4();
    rotMatrix.setRotate(degrees, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    
    let f_x = this.at.elements[0] - this.eye.elements[0];
    let f_y = this.at.elements[1] - this.eye.elements[1];
    let f_z = this.at.elements[2] - this.eye.elements[2];
    
    let f = new Vector3([f_x, f_y, f_z]);
    let f_prime = rotMatrix.multiplyVector3(f);
    
    this.at.elements[0] = this.eye.elements[0] + f_prime.elements[0];
    this.at.elements[1] = this.eye.elements[1] + f_prime.elements[1];
    this.at.elements[2] = this.eye.elements[2] + f_prime.elements[2];
    }

    panXYZ(pitch, yaw) {
    let f_x = this.at.elements[0] - this.eye.elements[0];
    let f_y = this.at.elements[1] - this.eye.elements[1];
    let f_z = this.at.elements[2] - this.eye.elements[2];
    
    let f = new Vector3([f_x, f_y, f_z]);
    let rotMatrix = new Matrix4();

    rotMatrix.setRotate(yaw, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    f = rotMatrix.multiplyVector3(f);

    let s_x = f.elements[1] * this.up.elements[2] - f.elements[2] * this.up.elements[1];
    let s_y = f.elements[2] * this.up.elements[0] - f.elements[1] * this.up.elements[2];
    let s_z = f.elements[0] * this.up.elements[1] - f.elements[1] * this.up.elements[0];

    let len = Math.sqrt(s_x*s_x + s_y*s_y + s_z*s_z);
    if (len > 0) {
        s_x /= len; s_y /= len; s_z /= len;

        let pitchMatrix = new Matrix4();
        pitchMatrix.setRotate(pitch, s_x, s_y, s_z);
        f = pitchMatrix.multiplyVector3(f);
    }

    this.at.elements[0] = this.eye.elements[0] + f.elements[0];
    this.at.elements[1] = this.eye.elements[1] + f.elements[1];
    this.at.elements[2] = this.eye.elements[2] + f.elements[2];
    }
}