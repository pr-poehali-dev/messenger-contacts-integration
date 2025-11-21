INSERT INTO chats (id, chat_type, name) VALUES (1, 'group', 'Общий чат') ON CONFLICT DO NOTHING;

INSERT INTO users (id, email, username, password_hash, avatar_url, status) 
VALUES (999, 'demo@example.com', 'Демо Пользователь', 'demo_hash', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo', 'online') 
ON CONFLICT DO NOTHING;

INSERT INTO chat_participants (chat_id, user_id) VALUES (1, 999) ON CONFLICT DO NOTHING;