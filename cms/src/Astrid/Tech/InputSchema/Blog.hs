module Astrid.Tech.InputSchema.Blog (BlogPost, BlogPostMeta) where

import Data.Aeson
import Data.Time.Clock
import GHC.Generics

data BlogPostMeta = BlogPostMeta
  { title :: String,
    assetRoot :: String,
    description :: String,
    date :: UTCTime,
    slug :: String,
    thumbnail :: Maybe String,
    excerpt :: Maybe String
  }
  deriving (Generic)

instance FromJSON BlogPostMeta

data BlogPost = BlogPost BlogPostMeta String
