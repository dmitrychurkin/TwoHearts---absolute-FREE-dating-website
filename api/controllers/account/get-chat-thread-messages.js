/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Get chat thread messages',


  description: '',


  inputs: {

  },


  exits: {

    invalid: {
      responseType: 'badRequest'
    },
    someError: {
      responseType: 'serverError'
    }

  },


  fn: async function (inputs, exits) {

    let { threadId, batch, skip } = this.req.allParams();
    const isInvalid = batch <= 0 || Number.isNaN(batch) || skip < 0;

    if (!this.req.isSocket || !threadId || isInvalid) {
      throw 'invalid';
    }

    try {

      const MESS_BATCH_SIZE = 10;
      const { uuid } = this.req.me;
      skip = Number.isInteger(skip) ? skip : 0;

      const CHAT_THREAD_MESS = {
        type: 'THREAD_MESS',
        code: 9,
        body: {
          thread: {
            isNew: false,
            id: threadId,
            batch,
            messagesReceived: true
          }
        }
      };

      const { displayMessagesAfter= 0 } = (await ClearUserMessageHistory.findOne({ where: { participantUUID: uuid, chatThreadId: threadId }, select: ['displayMessagesAfter'] })) || {};

      CHAT_THREAD_MESS.body.thread.messages = (await Message.find({ where: { threadId, toUUID: uuid, createdAt: { '>': displayMessagesAfter } }, limit: MESS_BATCH_SIZE, skip: ((batch - 1) * MESS_BATCH_SIZE) + skip, sort: 'createdAt DESC', omit: ['thread', 'deliveredAt', 'viewedAt', 'updatedAt', 'toUUID'] })
        .populate('author')
        .populate('messageData'))
        .map(message => {
          const author = {};
          for (const field of ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']) {
            author[field] = message.author[field];
          }
          const { messageText, attachment } = message.messageData;
          message.messageText = messageText;
          message.attachment = attachment;
          message.author = author;
          message.id = message.messageID;
          delete message.messageID;
          delete message.messageData;
          return message;
        }).sort((m1, m2) => m1.createdAt - m2.createdAt);

      return exits.success(CHAT_THREAD_MESS);

    } catch (e) {
      throw 'someError';
    }

    /*const foundThread = await ChatThread.findOne({ id: threadId })
                                  .populate('participants', {
                                    where: {
                                      uuid: { '!=': uuid }
                                    },
                                    select: ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']
                                  })
                                  .intercept(() => 'someError');
    if (!foundThread) {
      throw 'invalid';
    }

    const clearMessagesThread = await ClearUserMessageHistory.findOne({ participantUUID: uuid, chatThreadId: threadId }).intercept(() => 'someError');
    let messageCounts;
    try {
      messageCounts = await Promise.all([
        Message.count({ threadId, ...(clearMessagesThread && clearMessagesThread.displayMessagesAfter ? { createdAt: {'>': clearMessagesThread.displayMessagesAfter} } : {}) }),
        Message.count({ threadId, ...(clearMessagesThread && clearMessagesThread.displayMessagesAfter ? { createdAt: {'>': clearMessagesThread.displayMessagesAfter} } : {}), fromUUID: { '!=': uuid }, viewed: false }),
        Message.find({ where: { threadId, ...(clearMessagesThread && clearMessagesThread.displayMessagesAfter ? { createdAt: {'>': clearMessagesThread.displayMessagesAfter} } : {}) }, limit: MESS_BATCH_SIZE, skip: ((batch - 1) * MESS_BATCH_SIZE) + skip, sort: 'createdAt DESC', omit: ['thread','deliveredAt','viewedAt','updatedAt'] })
              .populate('author')
              // .eachRecord(message => {

              //   const author = {};
              //   for (const field of ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']) {
              //     author[field] = message.author[field];
              //   }

              //   message.author = author;

              //   messages.push(message);
              // })

      ]);
    }catch(e) { throw 'someError'; }

    foundThread.messageCounts = {
      total: messageCounts[0],
      new: messageCounts[1]
    };

    foundThread.messages = messageCounts[2].map(message => {
      const author = {};
      for (const field of ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']) {
        author[field] = message.author[field];
      }
      message.author = author;
      return message;
    }).sort((m1, m2) => m1.createdAt - m2.createdAt);

    foundThread.batch = batch;


    return exits.success(foundThread);*/

  }


};
