const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const titleScreen = document.getElementById('titleScreen');
const startButton = document.getElementById('startButton');
const restartScreen = document.getElementById('restartScreen');
const endMessage = document.getElementById('endMessage');
const restartButton = document.getElementById('restartButton');
const titleButton = document.getElementById('titleButton');

// スマホ用ボタンの操作
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const jumpButton = document.getElementById('jumpButton');
const shootButton = document.getElementById('shootButton');

// 左移動ボタン
leftButton.addEventListener('touchstart', () => keys.left = true);
leftButton.addEventListener('touchend', () => keys.left = false);

// 右移動ボタン
rightButton.addEventListener('touchstart', () => keys.right = true);
rightButton.addEventListener('touchend', () => keys.right = false);

// ジャンプボタン
jumpButton.addEventListener('touchstart', () => {
  if (player.isOnGround) {
    player.velocityY = player.jumpStrength;
    jumpSound.play();
  }
});

// ショットボタン
shootButton.addEventListener('touchstart', () => {
  if (player.canShoot) {
    shootFireball();
  }
});

// 左ボタンのタッチ・クリックイベント
document.getElementById('leftButton').addEventListener('mousedown', () => {
  keys.left = true;
});
document.getElementById('leftButton').addEventListener('mouseup', () => {
  keys.left = false;
});
document.getElementById('leftButton').addEventListener('touchstart', (e) => {
  e.preventDefault();
  keys.left = true;
});
document.getElementById('leftButton').addEventListener('touchend', (e) => {
  e.preventDefault();
  keys.left = false;
});

// 右ボタン
document.getElementById('rightButton').addEventListener('mousedown', () => {
  keys.right = true;
});
document.getElementById('rightButton').addEventListener('mouseup', () => {
  keys.right = false;
});
document.getElementById('rightButton').addEventListener('touchstart', (e) => {
  e.preventDefault();
  keys.right = true;
});
document.getElementById('rightButton').addEventListener('touchend', (e) => {
  e.preventDefault();
  keys.right = false;
});

// ジャンプボタン
document.getElementById('jumpButton').addEventListener('mousedown', () => {
  if (player.isOnGround) {
      player.velocityY = player.jumpStrength;
      jumpSound.play();
  }
});
document.getElementById('jumpButton').addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (player.isOnGround) {
      player.velocityY = player.jumpStrength;
      jumpSound.play();
  }
});

// ショットボタン
document.getElementById('shootButton').addEventListener('mousedown', () => {
  if (player.canShoot) {
      shootFireball();
  }
});
document.getElementById('shootButton').addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (player.canShoot) {
      shootFireball();
  }
});

let groundHeight = window.innerHeight * 0.8; // 地面の高さを設定
resizeCanvasAndUI(); // 初期化後に呼び出し

function resizeCanvasAndUI() {
  const canvas = document.getElementById('gameCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // コントロールボタンのサイズを調整
  document.querySelectorAll('.controlButton').forEach(button => {
      button.style.width = `${canvas.width * 0.07}px`; // 10%幅
      button.style.height = `${canvas.width * 0.07}px`; // 10%高さ
  });
}

// ウィンドウのリサイズ時に実行
window.addEventListener('resize', resizeCanvasAndUI);

// 初期化時に実行
resizeCanvasAndUI();

// プレイヤー画像（右向き・左向き）を読み込む
const playerImageRight = new Image();
playerImageRight.src = '01_player_right.png'; // 右向きの画像ファイル

const playerImageLeft = new Image();
playerImageLeft.src = '01_player_left.png'; // 左向きの画像ファイル

// 敵キャラクターの画像（右向き・左向き）を読み込む
const enemyImageRight = new Image();
enemyImageRight.src = '11_enemy1_right.png'; // 右向きの画像ファイル

const enemyImageLeft = new Image();
enemyImageLeft.src = '11_enemy1_left.png'; // 左向きの画像ファイル

// 飛ぶ敵キャラクターの画像を読み込む
const flyingEnemyImageRight = new Image();
flyingEnemyImageRight.src = '12_enemy2_right.png';

const flyingEnemyImageLeft = new Image();
flyingEnemyImageLeft.src = '12_enemy2_left.png';

// ボスキャラクターの画像を読み込む
const bossImage = new Image();
bossImage.src = '13_boss.png';

// 音声ファイルを読み込む
const jumpSound = new Audio('71_jump.mp3');
const itemSound = new Audio('72_item.mp3');
const breakSound = new Audio('73_break.mp3');
const bgMusic = new Audio('74_DigitalFlowers.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

// 読み込んだ画像のカウント
let imagesLoaded = 0;

// 画像読み込み完了時のカウントアップ
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 7) { // すべての画像が読み込まれたらスタート可能
    console.log('All images loaded.');
  }
}

playerImageRight.onload = imageLoaded;
playerImageLeft.onload = imageLoaded;
enemyImageRight.onload = imageLoaded;
enemyImageLeft.onload = imageLoaded;
flyingEnemyImageRight.onload = imageLoaded;
flyingEnemyImageLeft.onload = imageLoaded;
bossImage.onload = imageLoaded;

// スタートボタンのクリックイベント
startButton.addEventListener('click', () => {
  console.log('スタートボタンが押されました');
  if (imagesLoaded < 7) {
    console.log(`現在の画像読み込み数: ${imagesLoaded}`);
    alert('ゲームのリソースを読み込んでいます。少々お待ちください。');
    return;
  }
  console.log('ゲーム開始');
  titleScreen.style.display = 'none'; 
  canvas.style.display = 'block'; 
  bgMusic.currentTime = 0;  
  bgMusic.play().catch((err) => console.error('音楽再生エラー:', err));
  resetGame(); // ゲームをリセット
  gameLoop();
});

// Restartボタンのイベントリスナー
restartButton.addEventListener('click', () => {
  restartScreen.style.display = 'none'; // Restart画面を非表示
  bgMusic.currentTime = 0;
  bgMusic.play();
  player.isAlive = true; // プレイヤーを生存状態に戻す
  // 死亡した場所から200ポイント後退させて再スタート
  player.x = Math.max(player.x - 200, 0); // x座標が0未満にならないように調整
  player.y = groundHeight - player.height; // 地面の上に配置
  player.velocityX = 0;
  player.velocityY = 0;
  player.isOnGround = false; // 地面上でない状態からスタート
  gameLoop(); // ゲームループ再開
});

// タイトルボタンのクリックイベント
titleButton.addEventListener('click', () => {
  restartScreen.style.display = 'none'; // Restart画面を非表示
  titleScreen.style.display = 'flex'; // タイトル画面を表示
  canvas.style.display = 'none'; // ゲーム画面を非表示
  bgMusic.pause(); // 音楽を停止
  bgMusic.currentTime = 0; // 音楽を先頭に戻す
  resetGame(); // 全てをリセット
});

function restartGame() {
  player.isAlive = true; // プレイヤーを生存状態に戻す
  restartScreen.style.display = 'none';
  bgMusic.play(); // 音楽を再開
  gameLoop(); // ゲームループを再開
}

// 背景音楽の設定（リピート再生）
bgMusic.loop = true;
bgMusic.volume = 0.5; // 音量を調整（0.0 ～ 1.0）

// 背景音楽をフェードアウト
function fadeOutBackgroundMusic() {
  const fadeInterval = setInterval(() => {
    if (bgMusic.volume > 0.05) {
      bgMusic.volume -= 0.05;
    } else {
      bgMusic.volume = 0;
      bgMusic.pause();
      clearInterval(fadeInterval);
    }
  }, 200);
}

// ユーザー操作後に背景音楽を再生
window.addEventListener('click', () => {
  if (!bgMusic.playing) {
    bgMusic.play();
    bgMusic.playing = true; // フラグ設定
  }
});

bgMusic.play(); // 背景音楽を再生

// プレイヤーを描画する関数を修正
function drawPlayer() {
  if (player.direction === 'right') {
    ctx.drawImage(playerImageRight, player.x - cameraX, player.y, player.width, player.height);
  } else if (player.direction === 'left') {
    ctx.drawImage(playerImageLeft, player.x - cameraX, player.y, player.width, player.height);
  }
}

// プレイヤーの設定
const player = {
  x: 50,
  y: groundHeight - 30,
  width: 50,
  height: 50,
  color: 'red',
  velocityX: 0,
  velocityY: 0,
  speed: 3,
  gravity: 0.1,
  jumpStrength: -8,
  isAlive: true,
  isOnGround: false,
  canShoot: false, // ファイアボール発射可能か
  direction: 'right', // 向き: 'right' または 'left'
  score: 0,
};

// カメラの位置
let cameraX = 0;

// 障害物（土管）の設定
const obstacles = [
  { x: 300, y: groundHeight - 50, width: 50, height: 50 },
  { x: 700, y: groundHeight - 100, width: 50, height: 100 },
  { x: 1200, y: groundHeight - 50, width: 50, height: 50 },
  { x: 2000, y: groundHeight - 50, width: 50, height: 50 },
  { x: 3000, y: groundHeight - 100, width: 50, height: 100 },
  { x: 4000, y: groundHeight - 50, width: 50, height: 50 },
];

// ブロックの設定
const blocks = [
  { x: 400, y: groundHeight - 150, width: 50, height: 20 },
  { x: 800, y: groundHeight - 200, width: 50, height: 20 },
  { x: 1500, y: groundHeight - 250, width: 50, height: 20 },
  { x: 2500, y: groundHeight - 150, width: 50, height: 20 },
  { x: 3500, y: groundHeight - 200, width: 50, height: 20 },
];

// アイテムの設定（ファイアボール取得用）
const items = [
  { x: 450, y: groundHeight - 170, width: 20, height: 20, collected: false, type: 'fireball' },
  { x: 900, y: groundHeight - 220, width: 20, height: 20, collected: false, type: 'fireball' },
  { x: 2000, y: groundHeight - 270, width: 20, height: 20, collected: false, type: 'fireball' },
  { x: 3000, y: groundHeight - 170, width: 20, height: 20, collected: false, type: 'fireball' },
  { x: 4000, y: groundHeight - 220, width: 20, height: 20, collected: false, type: 'fireball' },
];

// 穴（落下ポイント）の設定
const holes = [
  { x: 600, y: groundHeight, width: 50, height: 30 },
  { x: 1400, y: groundHeight, width: 50, height: 30 },
  { x: 2200, y: groundHeight, width: 50, height: 30 },
  { x: 2600, y: groundHeight, width: 50, height: 30 },
  { x: 3800, y: groundHeight, width: 50, height: 30 },
];

// 敵キャラクターの設定
const enemies = [
  { x: 500, y: groundHeight - 50, width: 50, height: 50, speed: 1, direction: 1, alive: true, startX: 400, endX: 600 },
  { x: 800, y: groundHeight - 50, width: 50, height: 50, speed: 3, direction: -1, alive: true, startX: 700, endX: 900 },
  { x: 1500, y: groundHeight - 50, width: 50, height: 50, speed: 2, direction: 1, alive: true, startX: 1400, endX: 1600 },
  { x: 2500, y: groundHeight - 50, width: 50, height: 50, speed: 3, direction: -1, alive: true, startX: 2400, endX: 2600 },
  { x: 3500, y: groundHeight - 50, width: 50, height: 50, speed: 2, direction: 1, alive: true, startX: 3400, endX: 3600 },
  { x: 4500, y: groundHeight - 50, width: 50, height: 50, speed: 3, direction: -1, alive: true, startX: 4400, endX: 4600 },
];

// 飛ぶ敵キャラクターの設定
const flyingEnemies = [
  { x: 1000, y: groundHeight - 80, originalY: groundHeight - 80, width: 50, height: 50, speed: 1, direction: 1, alive: true, startX: 900, endX: 1100 },
  { x: 1800, y: groundHeight - 120, originalY: groundHeight - 120, width: 50, height: 50, speed: 1, direction: -1, alive: true, startX: 1700, endX: 2000 },
  { x: 2100, y: groundHeight - 160, originalY: groundHeight - 160, width: 50, height: 50, speed: 1, direction: 1, alive: true, startX: 2000, endX: 2200 },
  { x: 2400, y: groundHeight - 150, originalY: groundHeight - 150, width: 50, height: 50, speed: 1, direction: -1, alive: true, startX: 2300, endX: 2500 },
  { x: 2800, y: groundHeight - 150, originalY: groundHeight - 150, width: 50, height: 50, speed: 1, direction: 1, alive: true, startX: 2700, endX: 3000 },
  { x: 3200, y: groundHeight - 190, originalY: groundHeight - 190, width: 50, height: 50, speed: 1, direction: -1, alive: true, startX: 3000, endX: 3500 },
  { x: 4500, y: groundHeight - 200, originalY: groundHeight - 200, width: 50, height: 50, speed: 1, direction: -1, alive: true, startX: 4000, endX: 4600 },
  { x: 4600, y: groundHeight - 100, originalY: groundHeight - 100, width: 50, height: 50, speed: 1, direction: -1, alive: true, startX: 4000, endX: 4700 },
  { x: 4800, y: groundHeight - 130, originalY: groundHeight - 130, width: 50, height: 50, speed: 1, direction: -1, alive: true, startX: 4100, endX: 4900 },
];

// 飛ぶ敵を描画
function drawFlyingEnemies() {
  flyingEnemies.forEach(enemy => {
      if (enemy.alive) {
          if (enemy.direction === 1) {
              ctx.drawImage(flyingEnemyImageRight, enemy.x - cameraX, enemy.y, enemy.width, enemy.height);
          } else {
              ctx.drawImage(flyingEnemyImageLeft, enemy.x - cameraX, enemy.y, enemy.width, enemy.height);
          }
      }
  });
}

// 飛ぶ敵の移動処理
function moveFlyingEnemies() {
  flyingEnemies.forEach(enemy => {
      if (enemy.alive) {
          // x座標の移動処理
          enemy.x += enemy.speed * enemy.direction;

          // 移動範囲を超えたら方向を反転
          if (enemy.x <= enemy.startX || enemy.x >= enemy.endX) {
              enemy.direction *= -1;
          }

          // y座標のランダムな変動（オプション、必要な場合）
          if (Math.random() < 0.01) {
              enemy.y += (Math.random() > 0.5 ? 1 : -1) * 10; // 上下に少し動かす
          }

          // y座標を範囲内に制限
          enemy.y = Math.min(Math.max(enemy.originalY - 50, enemy.y), enemy.originalY + 50);
      }
  });
}

// ボスの設定
const boss = {
  x: 4900,
  y: groundHeight - 150, // 初期高さを地面に調整
  width: 400,
  height: 400,
  speed: 2,
  direction: -1,
  alive: true,
  health: 20,
};

// ボスを描画
function drawBoss() {
  if (boss.alive) {
    ctx.drawImage(bossImage, boss.x - cameraX, boss.y, boss.width, boss.height);
  }
}

const bossProjectiles = []; // ボスの弾を管理

function moveBoss() {
  if (boss.alive) {
    // ボスの移動処理
    boss.x += boss.speed * boss.direction;

    if (boss.x <= 4600 || boss.x >= 5000) {
      boss.direction *= -1; // 移動範囲を超えたら方向を反転
    }

    // ボスのジャンプ
    if (Math.random() < 0.01) {
      boss.y -= 200; // ジャンプ
    }
    boss.y = Math.min(boss.y + 5, groundHeight - boss.height); // 重力で地面に戻る

    // ボスの弾の発射
    if (Math.random() < 0.05) {
      bossProjectiles.push({
        x: boss.x + boss.width / 2,
        y: boss.y + boss.height / 2,
        width: 10,
        height: 10,
        speed: boss.direction === 1 ? 4 : -4,
      });
    }
  }
}

function drawBossProjectiles() {
  ctx.fillStyle = 'red';
  bossProjectiles.forEach(projectile => {
    ctx.fillRect(projectile.x - cameraX, projectile.y, projectile.width, projectile.height);
  });
}

function moveBossProjectiles() {
  bossProjectiles.forEach(projectile => {
    projectile.x += projectile.speed;

    // 画面外に出た弾を削除
    if (projectile.x < cameraX || projectile.x > cameraX + canvas.width) {
      const index = bossProjectiles.indexOf(projectile);
      if (index > -1) {
        bossProjectiles.splice(index, 1);
      }
    }
  });
}

// ボスとの衝突判定（ファイアボール）
function handleBossCollisions() {
  fireballs.forEach((fireball, index) => {
    if (boss.alive && checkCollision(fireball, boss)) {
      boss.health -= 1; // ボスの体力を減らす
      fireballs.splice(index, 1); // ファイアボールを削除
      if (boss.health <= 0) {
        boss.alive = false; // ボスを倒す
        player.score += 100; // スコア加算
        breakSound.play(); // 敵を倒した効果音を再生
      }
    }
  });
}

function handleBossPlayerCollision() {
  if (boss.alive && checkCollision(player, boss)) {
    player.isAlive = false; // プレイヤーがゲームオーバー
    endMessage.textContent = 'Game Over!'; // 終了メッセージ
    restartScreen.style.display = 'flex'; // Restart画面を表示
    fadeOutBackgroundMusic(); // 音楽をフェードアウト
  }
}

function handleBossProjectileCollisions() {
  bossProjectiles.forEach((projectile, index) => {
    if (checkCollision(player, projectile)) {
      player.isAlive = false; // プレイヤーがゲームオーバー
      endMessage.textContent = 'Game Over!'; // 終了メッセージ
      restartScreen.style.display = 'flex'; // Restart画面を表示
      fadeOutBackgroundMusic(); // 音楽をフェードアウト
      bossProjectiles.splice(index, 1); // 弾を削除
    }
  });
}

// ファイアボールの設定
const fireballs = [];

// ゴールの設定
const goal = { x: 5000, y: groundHeight - 50, width: 50, height: 50 };

// キーの押下状態を記録
const keys = {
  left: false,
  right: false,
  shoot: false, // ファイアボールを発射するキー
};

// 地面を描画
function drawGround() {
  ctx.fillStyle = 'brown';
  ctx.fillRect(0 - cameraX, groundHeight, goal.x + 200, canvas.height - groundHeight); // ゴールまで地面を描画
}

// 障害物を描画
function drawObstacles() {
  ctx.fillStyle = 'green';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x - cameraX, obstacle.y, obstacle.width, obstacle.height);
  });
}

// ブロックを描画
function drawBlocks() {
  ctx.fillStyle = 'blue';
  blocks.forEach(block => {
    ctx.fillRect(block.x - cameraX, block.y, block.width, block.height);
  });
}

// アイテムを描画
function drawItems() {
  ctx.fillStyle = 'gold';
  items.forEach(item => {
    if (!item.collected) {
      ctx.fillRect(item.x - cameraX, item.y, item.width, item.height);
    }
  });
}

// 穴を描画
function drawHoles() {
  ctx.fillStyle = 'black';
  holes.forEach(hole => {
    ctx.fillRect(hole.x - cameraX, hole.y, hole.width, hole.height);
  });
}

// 敵を描画
function drawEnemies() {
  enemies.forEach(enemy => {
    if (enemy.alive) {
      if (enemy.direction === 1) {
        // 右向き
        ctx.drawImage(enemyImageRight, enemy.x - cameraX, enemy.y, enemy.width, enemy.height);
      } else {
        // 左向き
        ctx.drawImage(enemyImageLeft, enemy.x - cameraX, enemy.y, enemy.width, enemy.height);
      }
    }
  });
}

// ファイアボールを描画
function drawFireballs() {
  ctx.fillStyle = 'orange';
  fireballs.forEach(fireball => {
    ctx.fillRect(fireball.x - cameraX, fireball.y, fireball.width, fireball.height);
  });
}

// ゴールを描画
function drawGoal() {
  ctx.fillStyle = 'orange';
  ctx.fillRect(goal.x - cameraX, goal.y, goal.width, goal.height);
}

// ファイアボールの移動処理
function moveFireballs() {
  fireballs.forEach((fireball, index) => {
    fireball.x += fireball.speed;

    // 画面外に出たファイアボールを削除
    if (fireball.x > cameraX + canvas.width || fireball.x < cameraX) {
      fireballs.splice(index, 1);
      return;
    }

    // 地上の敵に当たった場合
    enemies.forEach(enemy => {
      if (enemy.alive && checkCollision(fireball, enemy)) {
        enemy.alive = false; // 敵を倒す
        fireballs.splice(index, 1); // ファイアボールを削除
        player.score += 20; // スコア加算
        breakSound.play(); // 敵を倒した効果音を再生
      }
    });

    // 飛ぶ敵に当たった場合
    flyingEnemies.forEach(enemy => {
      if (enemy.alive && checkCollision(fireball, enemy)) {
        enemy.alive = false; // 飛ぶ敵を倒す
        fireballs.splice(index, 1); // ファイアボールを削除
        player.score += 30; // スコア加算
        breakSound.play();
      }
    });

    // ボスに当たった場合
    if (boss.alive && checkCollision(fireball, boss)) {
      boss.health -= 1; // ボスの体力を減らす
      fireballs.splice(index, 1); // ファイアボールを削除
      if (boss.health <= 0) {
        boss.alive = false; // ボスを倒す
        player.score += 100;
        breakSound.play();
      }
    }
  });
}

// 衝突判定
function checkCollision(player, obj) {
  return (
    player.x < obj.x + obj.width &&
    player.x + player.width > obj.x &&
    player.y < obj.y + obj.height &&
    player.y + player.height > obj.y
  );
}

// 敵との当たり判定を追加する関数
function handleEnemyCollisions() {
  enemies.forEach(enemy => {
    if (enemy.alive && checkCollision(player, enemy)) {
      if (player.y + player.height <= enemy.y + 20) { // 判定を緩くする
        enemy.alive = false; // 敵を倒す
        player.velocityY = player.jumpStrength / 2; // ジャンプ反動
        player.score += 20;
        breakSound.play();
      } else {
        player.isAlive = false; // ゲームオーバー
      }
    }
  });
}

function handleFlyingEnemyCollisions() {
  flyingEnemies.forEach(enemy => {
    if (enemy.alive && checkCollision(player, enemy)) {
      if (player.y + player.height <= enemy.y + 20) {
        // プレイヤーが上から当たった場合、敵を倒す
        enemy.alive = false;
        player.velocityY = player.jumpStrength / 2; // 反動でジャンプ
        player.score += 20; // スコア加算
        breakSound.play(); // 敵を倒した効果音を再生
      } else {
        // 横または下から当たった場合、ゲームオーバー
        player.isAlive = false;
      }
    }
  });
}

// 敵の移動処理（範囲制限を追加）
function moveEnemies() {
  enemies.forEach(enemy => {
    if (enemy.alive) {
      enemy.x += enemy.speed * enemy.direction;

      // 敵が移動範囲を超えたら方向を反転
      if (enemy.x <= enemy.startX || enemy.x >= enemy.endX) {
        enemy.direction *= -1;
      }
      // 敵がプレイヤーの近くに来たらスピードを上げる
      if (Math.abs(enemy.x - player.x) < 150) {
        enemy.speed = 2; // 攻撃モードでスピードアップ
      } else {
        enemy.speed = 2; // 通常のスピードに戻る
      }
    }
  });
}

// プレイヤーと障害物（土管・足場）の衝突処理を追加
function handleObstacleCollisions() {
  obstacles.forEach(obstacle => {
    if (checkCollision(player, obstacle)) {
      // 上方向からの衝突
      if (player.y + player.height <= obstacle.y + player.velocityY) {
        player.y = obstacle.y - player.height; // 上に停止
        player.velocityY = 0;
        player.isOnGround = true;
      } else {
        // 横方向の衝突
        if (player.x + player.width > obstacle.x && player.x < obstacle.x + obstacle.width) {
          if (player.velocityX > 0) {
            player.x = obstacle.x - player.width; // 右方向で衝突
          } else if (player.velocityX < 0) {
            player.x = obstacle.x + obstacle.width; // 左方向で衝突
          }
          player.velocityX = 0; // 横方向の速度をリセット
        }
      }
    }
  });

  blocks.forEach(block => {
    if (checkCollision(player, block)) {
      // 上方向からの衝突
      if (player.y + player.height <= block.y + player.velocityY) {
        player.y = block.y - player.height; // 上に停止
        player.velocityY = 0;
        player.isOnGround = true;
      }
    }
  });
}

// プレイヤーとアイテムの衝突処理を追加
function handleItemCollisions() {
  items.forEach(item => {
    if (!item.collected && checkCollision(player, item)) {
      item.collected = true; // アイテムを取得
      if (item.type === 'fireball') {
        player.canShoot = true; // ファイアボール発射可能になる
      }
      player.score += 10; // スコア加算
      itemSound.play(); // アイテム取得音を再生
    }
  });
}

// ファイアボールを発射する関数
function shootFireball() {
  if (player.canShoot) {
    fireballs.push({
      x: player.x + (player.direction === 'right' ? player.width : -10),
      y: player.y + player.height / 2,
      width: 10,
      height: 10,
      speed: player.direction === 'right' ? 8 : -8,
    });
    keys.shoot = false; // 発射後、キーをリセット
  }
}

// ファイアボールの移動処理（既存の関数を修正）
function moveFireballs() {
  fireballs.forEach((fireball, index) => {
    fireball.x += fireball.speed;

    // 画面外に出たファイアボールを削除
    if (fireball.x > cameraX + canvas.width || fireball.x < cameraX) {
      fireballs.splice(index, 1);
      return;
    }

    // 地上の敵に当たった場合
    enemies.forEach(enemy => {
      if (enemy.alive && checkCollision(fireball, enemy)) {
        enemy.alive = false; // 敵を倒す
        fireballs.splice(index, 1); // ファイアボールを削除
        player.score += 20; // スコア加算
        breakSound.play(); // 敵を倒した効果音を再生
      }
    });

    // 飛ぶ敵に当たった場合
    flyingEnemies.forEach(enemy => {
      if (enemy.alive && checkCollision(fireball, enemy)) {
        enemy.alive = false; // 飛ぶ敵を倒す
        fireballs.splice(index, 1); // ファイアボールを削除
        player.score += 30; // スコア加算
        breakSound.play();
      }
    });

    // ボスに当たった場合
    if (boss.alive && checkCollision(fireball, boss)) {
      boss.health -= 1; // ボスの体力を減らす
      fireballs.splice(index, 1); // ファイアボールを削除
      if (boss.health <= 0) {
        boss.alive = false; // ボスを倒す
        player.score += 100;
        breakSound.play();
      }
    }
  });
}

// キーボード入力処理の修正
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && player.isOnGround) {
    player.velocityY = player.jumpStrength; // ジャンプ
    jumpSound.play(); // ジャンプ音を再生
  }
  if (e.code === 'ArrowLeft') keys.left = true; // 左移動
  if (e.code === 'ArrowRight') keys.right = true; // 右移動
  if (e.code === 'KeyF') keys.shoot = true; // ファイアボール発射
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') keys.left = false; // 左移動解除
  if (e.code === 'ArrowRight') keys.right = false; // 右移動解除
  if (e.code === 'KeyF') shootFireball(); // Fキーを放したときにファイアボールを発射
});

function fadeOutBackgroundMusic() {
  const fadeInterval = setInterval(() => {
    if (bgMusic.volume > 0.05) {
      bgMusic.volume -= 0.05; // 音量を徐々に下げる
    } else {
      bgMusic.volume = 0;
      bgMusic.pause(); // 音楽を停止
      clearInterval(fadeInterval);
    }
  }, 200); // 200msごとに音量を下げる
}

function handleHoleCollisions() {
  holes.forEach(hole => {
    if (
      player.x + player.width > hole.x && // プレイヤーが穴の左端を越えた
      player.x < hole.x + hole.width &&  // プレイヤーが穴の右端を越えた
      player.y + player.height >= groundHeight // プレイヤーが地面の高さにいる
    ) {
      player.isAlive = false; // ゲームオーバー
      endMessage.textContent = 'Game Over!'; // 終了メッセージ
      restartScreen.style.display = 'flex'; // Restart画面を表示
      fadeOutBackgroundMusic(); // BGMをフェードアウト
    }
  });
}

// Restartボタンのイベントリスナー
restartButton.addEventListener('click', () => {
  bgMusic.play(); // 背景音楽を再生
  restartScreen.style.display = 'none'; // Restart画面を非表示
  player.isAlive = true; // プレイヤーを生存状態に戻す
  player.velocityX = 0;
  player.velocityY = 0;
  player.isOnGround = false; // 地面上でない状態からスタート
  gameLoop(); // ゲームループ再開
});

// ゲームリセット関数
function resetGame() {
  // プレイヤーの初期化
  player.x = 50;
  player.y = groundHeight - player.height;
  player.velocityX = 0;
  player.velocityY = 0;
  player.isAlive = true;
  player.isOnGround = true;
  player.score = 0;
  player.canShoot = false;
  player.direction = 'right';
  player.speed = 4; // 初期速度を設定

  // 敵の初期化
  enemies.forEach(enemy => {
    enemy.alive = true;
    enemy.x = enemy.startX;
    enemy.direction = 1;
    enemy.speed = 2; // 初期速度をリセット
  });

  // 飛ぶ敵の初期化
  flyingEnemies.forEach(enemy => {
    enemy.alive = true;
    enemy.x = enemy.startX;
    enemy.y = enemy.originalY; // 初期高さに戻す
    enemy.direction = 1; // 初期方向を設定
  });

  // ボスの初期化
  boss.alive = true;
  boss.health = 20;
  boss.x = 4900;
  boss.y = groundHeight - boss.height; // 地面に接地

  // アイテムの初期化
  items.forEach(item => {
    item.collected = false;
  });

  // カメラ位置の初期化
  cameraX = 0;

  // 背景音楽の音量をリセット
  bgMusic.currentTime = 0; // 音楽を最初に戻す
  bgMusic.volume = 0.5;
}

// プレイヤーの動作処理にファイアボール発射を追加
function gameLoop() {
  if (!player.isAlive) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    endMessage.textContent = 'Game Over!'; // 終了メッセージを設定
    restartScreen.style.display = 'flex'; // Restart画面を表示
    fadeOutBackgroundMusic(); // 背景音楽をフェードアウト
    return;
  }

  if (checkCollision(player, goal)) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    endMessage.textContent = 'You Win!'; // 勝利メッセージを設定
    restartScreen.style.display = 'flex'; // Restart画面を表示
    fadeOutBackgroundMusic(); // 背景音楽をフェードアウト
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 横方向の移動処理
  if (keys.left) {
    player.velocityX = -player.speed;
    player.direction = 'left';
  } else if (keys.right) {
    player.velocityX = player.speed;
    player.direction = 'right';
  } else {
    player.velocityX = 0;
  }

  // プレイヤーの位置を更新
  player.x += player.velocityX;

  // 重力処理
  player.velocityY += player.gravity;
  player.y += player.velocityY;
  player.isOnGround = false;



  // 地面で停止
  if (player.y + player.height > groundHeight) {
    player.y = groundHeight - player.height;
    player.velocityY = 0;
    player.isOnGround = true;
  }

  // カメラ位置の更新
  cameraX = Math.max(player.x - canvas.width / 2, 0);
  
  // 敵の移動処理
  moveEnemies();
  moveFlyingEnemies();
  moveBoss();
  moveFireballs();
  moveBossProjectiles(); // ボスの弾を移動

  // 衝突処理
  handleObstacleCollisions(); // 土管や足場との衝突
  handleItemCollisions(); // アイテムの取得
  handleEnemyCollisions(); // 敵との衝突
  handleFlyingEnemyCollisions(); // 飛ぶ敵との衝突を判定
  handleHoleCollisions(); // 穴との衝突
  handleBossPlayerCollision(); // ボスとの衝突
  handleBossProjectileCollisions(); // ボスの弾との衝突
  handleBossCollisions(); // ボスへの攻撃

  // 描画処理
  drawGround();
  drawObstacles();
  drawBlocks();
  drawItems();
  drawHoles();
  drawEnemies();
  drawFlyingEnemies();
  drawFireballs();
  drawBossProjectiles(); // ボスの弾を描画
  drawBoss();
  drawPlayer();
  drawGoal();

  // スコア表示
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + player.score, 10, 20);

  requestAnimationFrame(gameLoop);
}

// キーボード入力でジャンプと移動
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && player.isOnGround) {
    player.velocityY = player.jumpStrength;
  }
  if (e.code === 'ArrowLeft') keys.left = true;
  if (e.code === 'ArrowRight') keys.right = true;
  if (e.code === 'KeyF') keys.shoot = true; // ファイアボール発射
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') keys.left = false;
  if (e.code === 'ArrowRight') keys.right = false;
});

// ゲーム開始
gameLoop();

// 初期画面の設定
window.onload = () => {
  titleScreen.style.display = 'flex'; // タイトル画面を表示
  canvas.style.display = 'none'; // ゲーム画面を非表示
  restartScreen.style.display = 'none'; // Restart画面も非表示
};


