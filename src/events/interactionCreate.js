const Canvas = require("canvas");
const { 
    Role,
    GuildChannel,
    GuildMember,
    User,
    InteractionType,
    ApplicationCommandType
} = require("discord.js");
const Event = require("../utils/classes/Event");
module.exports = new Event({
    name: 'interactionCreate',

    /** @param {CommandInteraction} run */
    async run(client, interaction) {

        if (interaction.type != InteractionType.ApplicationCommand) return;
        const cmd = client.commands.get(interaction.commandName);

        if (cmd.ownerOnly && interaction.user != client.application.owner) {
            return interaction.reply({
                content: 'This command is developer only.',
                ephemeral: true
            });
        }

        if (cmd.clientPermissions && !cmd.clientPermissions.every(p => interaction.appPermissions.has(p))) {
            const p = cmd.clientPermissions.map(p => client.names.permissions[p]);
            return interaction.reply({
                content: `I need **${p.length > 1 ? `${p.slice(0, -1).join(', ')} and ${p.slice(-1)[0]}` : p[0]}** permissions to run this command.`,
                ephemeral: true
            });
        }

        // Chat input command handling
        switch (interaction.commandType) {
            case ApplicationCommandType.ChatInput: {
                /** @type {import("../utils/classes/Command").CommandOptionsOption[]} */
                const options = cmd.options?.find(o => o.type == 'SubcommandGroup' && o.name == interaction.options.getSubcommandGroup(false))?.options
                .map(o => o.options?.find(o => o.type == 'Subcommand' && o.name == interaction.options.getSubcommand(false)))?.options
                || cmd.options?.find(o => o.type == 'Subcommand' && o.name == interaction.options.getSubcommand(false))?.options || cmd.options;

                for (const option of options || []) {
                    switch(option.type) {
                        case 'User': {
                            /** @type {GuildMember | User} */
                            const member = interaction.options.getMember(option.name) || interaction.options.getUser(option.name);
                            if (member) {
                                if (option.notYourself && member.id == interaction.user.id) {
                                    return interaction.reply({
                                        content: 'You need to mention someone else than yourself.',
                                        ephemeral: true
                                    });
                                }

                                if (option.notClient && member.id == client.user.id) {
                                    return interaction.reply({
                                        content: 'You need to mention someone else than me.',
                                        ephemeral: true
                                    });
                                }

                                if (option.notGuildOwner && member.id == interaction.guild?.ownerId) {
                                    return interaction.reply({
                                        content: 'You can\'t mention the owner of the server.',
                                        ephemeral: true
                                    });
                                }

                                if (option.guildMember && !member.user) {
                                    return interaction.reply({
                                        content: `**${client.escMD(member.tag)}** needs to be in the server.`,
                                        ephemeral: true
                                    });
                                }

                                if (member.user) {

                                    if (option.higherRole && interaction.user.id != interaction.guild.ownerId && interaction.member.roles.highest.position <= member.roles.highest.position) {
                                        return interaction.reply({
                                            content: `You need a role higher than **${client.escMD(member.user.tag)}** to do this.`,
                                            ephemeral: true
                                        });
                                    }

                                    if (option.botHigherRole && interaction.guild.members.me.roles.highest.position <= member.roles.highest.position) {
                                        return interaction.reply({
                                            content: `I need a role higher than **${client.escMD(member.user.tag)}** to do this.`,
                                            ephemeral: true
                                        });
                                    }
                                }
                            }
                        } break;

                        case 'Channel': {
                            /** @type {GuildChannel} */
                            const channel = interaction.options.getChannel(option.name) || interaction.channel;
                            if (option.clientPermissions && !option.clientPermissions.every(p => interaction.guild.members.me.permissionsIn(channel).has(p))) {
                                const p = option.clientPermissions.map(p => client.names.permissions[p]);
                                return interaction.reply({
                                    content: `I need **${p.length > 1 ? `${p.slice(0, -1).join(', ')} and ${p.slice(-1)[0]}` : p[0]}** permissions in ${channel} to run this command.`,
                                    ephemeral: true
                                });
                            }
                        } break;

                        case 'Role': {
                            /** @type {Role} */
                            const role = interaction.options.getRole(option.name);
                            if (role) {
                                if (option.notIntegrated && role.managed) {
                                    return interaction.reply({
                                        content: `${role} is managed by an integration.`,
                                        ephemeral: true
                                    });
                                }

                                if (option.higher && interaction.user.id != interaction.guild.ownerId && role.position >= interaction.member.roles.highest.position) {
                                    return interaction.reply({
                                        content: `${role} needs to be lower than your highest role in hierachy.`,
                                        ephemeral: true
                                    });
                                }

                                if (option.higherFromBot && interaction.user.id != interaction.guild.ownerId && role.position >= interaction.guild.members.me.roles.highest.position) {
                                    return interaction.reply({
                                        content: `${role} needs to be lower than my highest role in hierachy.`,
                                        ephemeral: true
                                    });
                                }
                            }
                        } break;

                        case 'Attachment': {
                            const attachment = interaction.options.getAttachment(option.name);
                            if (attachment) {

                                if (option.canvas) try {
                                    await Canvas.loadImage(attachment.url);
                                } catch {
                                    return interaction.reply({
                                        content: 'This file format is not supported.',
                                        ephemeral: true
                                    });
                                }

                            }
                        } break;
                    }
                }
            } break;

            case ApplicationCommandType.User: {
            } break;

            case ApplicationCommandType.Message: {
                if (cmd.withContent && !interaction.targetMessage.content) return interaction.reply({
                    content: 'This message must include some content in it.',
                    ephemeral: true
                });
            } break;
        }

        await cmd.run(interaction, client);
    }
});