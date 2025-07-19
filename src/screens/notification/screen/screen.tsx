import { View, Text, ScrollView } from "react-native";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const notificationsData: NotificationItem[] = [
  {
    id: "ehfroghrughu",
    title: "Today's Outfit Reminder",
    message: "Pair your white shirt and blue jeans for a casual look.",
    timestamp: new Date(),
    read: false,
  },
  {
    id: "eriurghuoihyfh",
    title: "Reminder: Formal Event Tonight",
    message: "Don't forget the black dress you've prepared.",
    timestamp: new Date(),
    read: true,
  },
  {
    id: "bvwuirhgiuerh",
    title: "Yesterday's Casual Look",
    message: "A review of the gray hoodie and black joggers combo.",
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    read: true,
  },
];

type NotificationCardProps = {
  key: string;
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
};

const NotificationCard = (props: NotificationCardProps) => {
  const { title, message, time, date, isRead } = props;

  return (
    <View className="flex-row bg-white rounded-lg shadow-sm mb-3 overflow-hidden border border-gray-100">
      <View className="w-1.5 bg-primary" />
      <View className="flex-1 p-4">
        <Text className="text-base font-bold text-gray-800">{title}</Text>
        <Text className="text-sm text-gray-500 mt-1">{message}</Text>
        <Text className="text-xs text-gray-400 mt-2">{`${date} at ${time}`}</Text>
      </View>
      {!isRead && (
        <View className="w-2.5 h-2.5 bg-primary rounded-full absolute top-4 right-4" />
      )}
    </View>
  );
};

const groupNotificationsByDay = (notifications: NotificationItem[]) => {
  const groups: { [key: string]: NotificationItem[] } = {
    Today: [],
    Yesterday: [],
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  notifications.forEach((notif) => {
    const notifDate = new Date(notif.timestamp);
    const dayKey = notifDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (notifDate.toDateString() === today.toDateString()) {
      groups["Today"].push(notif);
    } else if (notifDate.toDateString() === yesterday.toDateString()) {
      groups["Yesterday"].push(notif);
    } else {
      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }
      groups[dayKey].push(notif);
    }
  });

  if (groups["Today"].length === 0) delete groups["Today"];
  if (groups["Yesterday"].length === 0) delete groups["Yesterday"];

  return groups;
};

const NotificationScreen = () => {
  const groupedNotifications = groupNotificationsByDay(notificationsData);
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {Object.keys(groupedNotifications).length > 0 ? (
          Object.entries(groupedNotifications).map(([day, notifications]) => (
            <View key={day} className="mb-4">
              <Text className="text-lg font-bold text-gray-700 mb-3">
                {day}
              </Text>
              {notifications.map((item) => (
                <NotificationCard
                  key={item.id}
                  title={item.title}
                  message={item.message}
                  time={new Date(item.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  date={new Date(item.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  isRead={item.read}
                />
              ))}
            </View>
          ))
        ) : (
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-gray-400">No reminders yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;
