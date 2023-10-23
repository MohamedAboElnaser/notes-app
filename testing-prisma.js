const { PrismaClient, Prisma } = require("@prisma/client");

const db = new PrismaClient();

const user = {
    name: "ali",
    email: "ali@gmail.com",
    password: "test1234",
};
const note = {
    title: "study",
    body: "review section 24 of node js corse at udemy",
    authorId: 1,
};
async function createUser(user_data) {
    const userRecord = await db.user.create({
        data: user_data,
    });
    console.log("UserRecord:", userRecord);
}
async function createNote(note_data) {
    const note = await db.note.create({
        data: note_data,
    });
    console.log("Created_note: ", note);
}

async function getAllUserNotes(id) {
    const notes = await db.note.findMany({
         where:{
            authorId:id
         }
    });

    console.log("users notes : ", notes);
}
// createUser(user);
// createNote(note);
getAllUserNotes(3);
