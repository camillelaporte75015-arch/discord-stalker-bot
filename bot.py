import discord
from discord.ext import commands
import json

bot = commands.Bot(command_prefix='+')

# Événement prêt
@bot.event
async def on_ready():
    print(f'{bot.user} s\'est connecté !')

# Commande +stalk
@bot.command(name='stalk')
async def stalk(ctx, member: discord.Member):
    # Créez un salon privé
    channel = await ctx.guild.create_text_channel(f'stalker-{ctx.author.id}-{member.id}')

    # Créez un embed avec les informations
    embed = discord.Embed(title='Tu stalk maintenant')
    embed.add_field(name='Stalker', value=ctx.author.mention)
    embed.add_field(name='Cible', value=member.mention)
    embed.add_field(name='Informations', value='Tout ce que la cible fera te sera transféré ici')

    # Ajoutez un bouton pour la notification
    button = discord.ui.Button(label='Être mentionné', custom_id='notification')
    view = discord.ui.View()
    view.add_item(button)

    # Enverrez l'embed et le bouton
    await channel.send(embed=embed, view=view)

    # Sauvegardez les informations de stalk
    with open('stalk.json', 'r+') as f:
        data = json.load(f)
        data['stalks'].append({
            'stalker': ctx.author.id,
            'cible': member.id,
            'channel': channel.id
        })
        json.dump(data, f)

# Commande +antistalk
@bot.command(name='antistalk')
async def antistalk(ctx, member: discord.Member):
    # Ajoutez la personne à la liste des antistalks
    with open('antistalk.json', 'r+') as f:
        data = json.load(f)
        data['antistalks'].append(member.id)
        json.dump(data, f)

# Commande +restalk
@bot.command(name='restalk')
async def restalk(ctx, member: discord.Member):
    # Supprimez la personne de la liste des antistalks
    with open('antistalk.json', 'r+') as f:
        data = json.load(f)
        data['antistalks'].remove(member.id)
        json.dump(data, f)

# Commande +stop
@bot.command(name='stop')
async def stop(ctx):
    # Supprimez le salon privé
    channel = ctx.channel
    await channel.delete()

# Exécution du bot
bot.run('VOTRE_TOKEN_DISCORD')
