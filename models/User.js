class User {
  constructor(authId, privateId, publicId, name, email, image, highestScore) {
    this.authId = authId;
    this.privateId = privateId;
    this.publicId = publicId;
    this.name = name;
    this.email = email;
    this.image = image;
    this.highestScore = highestScore;
  }
}

export default User;
