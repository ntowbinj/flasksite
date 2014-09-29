from peewee import *
import peewee

database = MySQLDatabase('blog', **{'user': 'root', 'passwd': 'roont'})

class BaseModel(Model):
    class Meta:
        database = database

class Post(BaseModel):
    text = TextField()
    date = DateField()
    title = CharField()
    live = IntegerField()

    class Meta:
        order_by = ('date',)

    @classmethod
    def create_or_update(cls, title, date, text, live, tags):
        try:
            post = cls.create(title=title, date=date, text=text, live=live)
        except peewee.IntegrityError:
            post = cls.get(date=date)
            newtext = text
            post.title = title
            post.live = live
            post.text = text
            post.date = date
            post.save()
        for tag_name in tags:
            try:
                tag = Tag.get(Tag.name == tag_name)
            except peewee.DoesNotExist:
                tag = Tag.create(name = tag_name)
            try:
                Tagging.create(post=post, tag=tag)
            except peewee.IntegrityError:
                pass
        return post

    def tags(self):
        return Tag.select().join(Tagging).join(Post).where(Post.id == self)

class Tag(BaseModel):
    name = CharField()
    
    def posts(self):
        return Post.select().join(Tagging).join(Tag).where(Tag.id == self)

class Tagging(BaseModel):
    post = ForeignKeyField(Post)
    tag = ForeignKeyField(Tag)

if __name__ == "__main__":
    python_tag = Tag.select().where(Tag.name=="python")[0]
    posts = python_tag.posts()
    for post in posts:
        print post.text

    post = Post.select()[0]
    tags = post.tags()
    print post.text
    for tag in tags:
        print tag.name


