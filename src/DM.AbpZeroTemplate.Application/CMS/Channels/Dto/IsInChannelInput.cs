using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DM.AbpZeroTemplate.CMS.Channels.Dto
{
    public class IsInChannelInput : IInputDto
    {
        /// <summary>
        /// 内容Id
        /// </summary>
        [Range(1, long.MaxValue)]
        public long ContentId { get; set; }

        /// <summary>
        /// 栏目Id
        /// </summary>
        [Range(1, long.MaxValue)]
        public long ChannelId { get; set; }
    }
}
