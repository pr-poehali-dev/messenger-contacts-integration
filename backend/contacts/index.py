import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage user contacts and friend requests
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response with contacts list or operation status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            user_id = params.get('user_id')
            request_type = params.get('type', 'contacts')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing user_id'}),
                    'isBase64Encoded': False
                }
            
            if request_type == 'contacts':
                cursor.execute("""
                    SELECT u.id, u.username, u.avatar_url, u.status
                    FROM contacts c
                    JOIN users u ON c.contact_user_id = u.id
                    WHERE c.user_id = %s AND c.status = 'accepted'
                """, (user_id,))
                
                contacts = []
                for row in cursor.fetchall():
                    contacts.append({
                        'id': row[0],
                        'username': row[1],
                        'avatar_url': row[2],
                        'status': row[3]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'contacts': contacts}),
                    'isBase64Encoded': False
                }
            
            elif request_type == 'requests':
                cursor.execute("""
                    SELECT u.id, u.username, u.avatar_url, c.created_at
                    FROM contacts c
                    JOIN users u ON c.user_id = u.id
                    WHERE c.contact_user_id = %s AND c.status = 'pending'
                """, (user_id,))
                
                requests = []
                for row in cursor.fetchall():
                    requests.append({
                        'id': row[0],
                        'username': row[1],
                        'avatar_url': row[2],
                        'timestamp': row[3].strftime('%H:%M')
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'requests': requests}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            contact_email = body_data.get('contact_email')
            
            if not user_id or not contact_email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("SELECT id FROM users WHERE email = %s", (contact_email,))
            contact_user = cursor.fetchone()
            
            if not contact_user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "INSERT INTO contacts (user_id, contact_user_id, status) VALUES (%s, %s, 'pending')",
                (user_id, contact_user[0])
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Friend request sent'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            contact_user_id = body_data.get('contact_user_id')
            action = body_data.get('action')
            
            if not user_id or not contact_user_id or not action:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            if action == 'accept':
                cursor.execute(
                    "UPDATE contacts SET status = 'accepted' WHERE user_id = %s AND contact_user_id = %s",
                    (contact_user_id, user_id)
                )
                cursor.execute(
                    "INSERT INTO contacts (user_id, contact_user_id, status) VALUES (%s, %s, 'accepted')",
                    (user_id, contact_user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Friend request accepted'}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
