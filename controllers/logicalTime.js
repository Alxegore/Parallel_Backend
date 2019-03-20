
async function updateLogicalTime(){
    await logicalTime.updateOne({logicalTime: globalLogicalTime});
}

async function getLogicalTime(){
    var query = await logicalTime.findOne()
    globalLogicalTime = query.logicalTime + 1;
    await updateLogicalTime()
}


(async () => {
    await getLogicalTime()
})()
