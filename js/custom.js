// 图片模糊到清晰效果实现
document.addEventListener('DOMContentLoaded', function() {
  // 为所有图片添加渐进式加载效果
  const images = document.querySelectorAll('img:not(.no-progressive)');
  
  images.forEach(img => {
    // 跳过已经加载的图片
    if (img.complete) {
      addProgressiveEffect(img);
      return;
    }
    
    // 为图片添加容器和效果
    const container = document.createElement('div');
    container.className = 'progressive-img';
    
    // 将图片移动到容器中
    img.parentNode.insertBefore(container, img);
    container.appendChild(img);
    
    // 监听图片加载完成事件
    img.addEventListener('load', function() {
      container.classList.add('loaded');
      img.classList.add('loaded');
    });
    
    // 处理图片加载失败的情况
    img.addEventListener('error', function() {
      container.classList.add('loaded');
      img.classList.add('loaded');
    });
    
    // 如果图片已经缓存，手动触发load事件
    if (img.complete) {
      img.dispatchEvent(new Event('load'));
    }
  });
});
