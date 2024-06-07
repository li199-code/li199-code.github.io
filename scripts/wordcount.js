hexo.extend.filter.register('before_post_render', async function (data) {
    const content = data.content || '';
    const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/gm, '');
    const cnWordCount = (contentWithoutCodeBlocks.match(/[\u4e00-\u9fa5]/g) || []).length;
    const enWordCount = (contentWithoutCodeBlocks.replace(/[\u4e00-\u9fa5]/g, '').match(/\b\w+\b/g) || []).length;
    data.cn_wordcount = cnWordCount;
    data.en_wordcount = enWordCount;
    data.word_count = cnWordCount + enWordCount;
    return data;
});