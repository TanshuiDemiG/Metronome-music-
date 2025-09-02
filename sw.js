// Service Worker for 专业节拍器 PWA | Metronome PWA Service Worker
const CACHE_NAME = 'metronome-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/i18n.js',
  '/manifest.json'
];

// 安装事件 - 缓存资源 | Install event - Cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing... | 正在安装...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files | 缓存文件中');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully | 安装成功');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed | 安装失败', error);
      })
  );
});

// 激活事件 - 清理旧缓存 | Activate event - Clean old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating... | 正在激活...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache | 删除旧缓存', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated successfully | 激活成功');
      return self.clients.claim();
    })
  );
});

// 拦截网络请求 - 缓存优先策略 | Fetch event - Cache first strategy
self.addEventListener('fetch', event => {
  // 只处理同源请求 | Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，直接返回缓存 | If cached, return from cache
        if (response) {
          console.log('Service Worker: Serving from cache | 从缓存提供', event.request.url);
          return response;
        }

        // 否则从网络获取 | Otherwise fetch from network
        console.log('Service Worker: Fetching from network | 从网络获取', event.request.url);
        return fetch(event.request)
          .then(response => {
            // 检查响应是否有效 | Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应用于缓存 | Clone response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed | 获取失败', error);
            // 如果是HTML请求且网络失败，返回离线页面 | Return offline page for HTML requests
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// 处理消息事件
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 后台同步事件（可选）
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    // 这里可以添加后台同步逻辑
  }
});

// 推送通知事件（可选）
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/manifest-icon-192.png',
      badge: '/manifest-icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: '打开节拍器',
          icon: '/manifest-icon-192.png'
        },
        {
          action: 'close',
          title: '关闭'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('节拍器通知', options)
    );
  }
});

// 通知点击事件
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});