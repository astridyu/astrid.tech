{-# LANGUAGE QuasiQuotes #-}

module Astrid.Tech.InputSchema.PageSpec
  ( spec,
  )
where

import Astrid.Tech.InputSchema.Page
import Control.Exception (evaluate)
import Control.Monad.IO.Class (MonadIO (liftIO))
import Data.Aeson (FromJSON)
import Data.ByteString (ByteString)
import Data.Text (Text, strip)
import GHC.Generics (Generic)
import Test.Hspec
import Test.QuickCheck
import Text.RawString.QQ (r)

data ExampleFrontMatter = ExampleFrontMatter
  { a :: String,
    b :: Integer
  }
  deriving (Generic, Show, Eq)

instance FromJSON ExampleFrontMatter

type FMResult = PageParseResult ExampleFrontMatter

markdownWithFrontMatter :: ByteString
markdownWithFrontMatter =
  [r|---
a: "boat"
b: 31
---

# Title of my post
|]

expectedMarkdownContent :: Text
expectedMarkdownContent = "\n# Title of my post\n"

spec :: Spec
spec = do
  describe "detectFormatFromExtension" $ do
    it "returns the extension for unsupported extensions" $
      detectFormatFromExtension ".exe" `shouldBe` Left ".exe"

  describe "parsePage" $ do
    it "parses markdown" $
      case parsePage "directory" "someslug.md" markdownWithFrontMatter :: FMResult of
        Right (fm, page) -> do
          fm `shouldBe` ExampleFrontMatter {a = "boat", b = 31}
          content page `shouldBe` expectedMarkdownContent
        Left err -> error $ show err

    it "throws errors for unsupported extensions" $
      (parsePage "directory" "virus.exe" markdownWithFrontMatter :: FMResult)
        `shouldBe` Left (UnsupportedFormat ".exe")
