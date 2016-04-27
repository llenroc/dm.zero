using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.CMS.Contents.Dto;
using Abp.Contents;
using Abp.AutoMapper;

namespace DM.AbpZeroTemplate.CMS.Contents
{
    public class ContentAppService : AbpZeroTemplateServiceBase, IContentAppService
    {
        private readonly ContentManager _contentManager;

        public ContentAppService(ContentManager contentManager)
        {
            _contentManager = contentManager;
        }

        public async Task<ContentDto> CreateContent(CreateContentInput input)
        {
            var content = new Content(input.AppId, input.ChannelId, input.Title, input.ContentText);
            await _contentManager.CreateAsync(content);
            await CurrentUnitOfWork.SaveChangesAsync();
            return content.MapTo<ContentDto>();
        }

        public async Task DeleteContent(IdInput<long> input)
        {
            await _contentManager.DeleteAsync(input.Id);
        }

        public async Task<ListResultOutput<ContentDto>> GetContents(IdInput<long> input)
        {
            var channelId = input.Id;
            var contents = await _contentManager.FindContentsByChannelIdAsync(channelId, false);
            return new ListResultOutput<ContentDto>(contents.Select(
                item =>
                {
                    var dto = item.MapTo<ContentDto>();
                    return dto;
                }
                ).ToList());
        }

        public async Task<ContentDto> MoveContent(MoveContentInput input)
        {
            if (input.NewChannelId.HasValue)
                await _contentManager.MoveAsync(input.Id, input.NewChannelId.Value);
            var content = await _contentManager.ContentRepository.GetAsync(input.Id);
            return content.MapTo<ContentDto>();
        }

        public async Task<ContentDto> UpdateContent(UpdateContentInput input)
        {
            var content = await _contentManager.ContentRepository.GetAsync(input.Id);
            content.Title = input.Title;
            content.ContentText = input.ContentText;

            await _contentManager.UpdateAsync(content);

            await CurrentUnitOfWork.SaveChangesAsync();
            return content.MapTo<ContentDto>();
        }
    }
}
