// import React, { useMemo } from 'react';
// import { Text, View } from 'react-native';

import { useMemo } from 'react';

// const ChatScreen = ({ messages }) => {
//   const today = useMemo(() => new Date(), []);
//   const yesterday = useMemo(() => {
//     const y = new Date();
//     y.setDate(y.getDate() - 1);
//     return y;
//   }, []);

//   const filteredMessages = useMemo(() => {
//     const messagesByMonth = {};
//     const todayMessages = [];
//     const yesterdayMessages = [];

//     messages.forEach(m => {
//       const messageDate = new Date(m.timestamp);
//       const messageMonth = messageDate.toLocaleString('default', {
//         month: 'long',
//       });

//       if (messageDate.toDateString() === today.toDateString()) {
//         todayMessages.push(m);
//       } else if (messageDate.toDateString() === yesterday.toDateString()) {
//         yesterdayMessages.push(m);
//       }

//       if (!messagesByMonth[messageMonth]) {
//         messagesByMonth[messageMonth] = [];
//       }
//       messagesByMonth[messageMonth].push(m);
//     });

//     return { todayMessages, yesterdayMessages, messagesByMonth };
//   }, [messages, today, yesterday]);

//   return (
//     <View>
//       {filteredMessages.todayMessages.length > 0 && (
//         <View>
//           <Text>Today</Text>
//           {filteredMessages.todayMessages.map((m, i) => (
//             <Text key={i}>{m.text}</Text>
//           ))}
//         </View>
//       )}
//   {filteredMessages.yesterdayMessages.length > 0 && (
//     <View>
//       <Text>Yesterday</Text>
//       {filteredMessages.yesterdayMessages.map((m, i) => (
//         <Text key={i}>{m.text}</Text>
//       ))}
//     </View>
//   )}
//       {Object.keys(filteredMessages.messagesByMonth).map((month, i) => (
//         <View key={i}>
//           <Text>{month}</Text>
//           {filteredMessages.messagesByMonth[month].map((m, j) => (
//             <Text key={j}>{m.text}</Text>
//           ))}
//         </View>
//       ))}
//     </View>
//   );
// };

// export default ChatScreen;

export const filteredMessages = (messages, today, yesterday) => {
  //   const today = () => new Date();
  //   const yesterday = useMemo(() => {
  //     const y = new Date();
  //     y.setDate(y.getDate() - 1);
  //     return y;
  //   }, []);
  const messagesByMonth = {};
  const todayMessages = [];
  const yesterdayMessages = [];
  console.log(messages, today, yesterday, 'TFFGH');
  messages.forEach(m => {
    const messageDate = new Date(m.sentAt * 1000);
    const messageMonth = messageDate.toString();
    console.log(yesterday, 'yesterday in function');
    console.log(messageDate.toDateString(), 'date converted to string');
    if (messageDate.toDateString() === today) {
      console.log(messageDate.toDateString(), 'date converted to string');
      todayMessages.push(m);
    } else if (messageDate.toDateString() === yesterday) {
      yesterdayMessages.push(m);
    }

    if (!messagesByMonth[messageMonth]) {
      messagesByMonth[messageMonth] = [];
    }
    messagesByMonth[messageMonth].push(m);
  });

  return { todayMessages, yesterdayMessages, messagesByMonth };
};
