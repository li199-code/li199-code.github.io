hexo.extend.filter.register('before_post_render', async function (data) {
    const content = data.content || '';
    const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/gm, '');
    const charCount = contentWithoutCodeBlocks.length;
    data.word_count = charCount;
    return data;
});